package bootstrap

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// EnsureNode gets existing node or creates it (idempotent)
// Returns node ID on success
func EnsureNode(ctx context.Context, client *Client, spec NodeSpec, parentID string) (string, error) {
	// Step 1: Query for existing node
	filter := fmt.Sprintf(`type is "%s"`, spec.Type)
	if parentID != "" {
		filter += fmt.Sprintf(` and parentId is "%s"`, parentID)
	}

	existing, err := queryNodes(ctx, client, filter)
	if err != nil {
		return "", fmt.Errorf("query existing node: %w", err)
	}

	if len(existing) > 0 {
		return existing[0].ID, nil // Already exists
	}

	// Step 2: Create node
	nodeID, err := createNode(ctx, client, spec, parentID)
	if err != nil {
		return "", fmt.Errorf("create node: %w", err)
	}

	return nodeID, nil
}

// EnsureHierarchy creates service root + collection nodes (idempotent)
func EnsureHierarchy(ctx context.Context, client *Client, spec HierarchySpec) (*HierarchyResult, error) {
	// Validate plugin node ID is provided
	if spec.PluginNodeID == "" {
		return nil, fmt.Errorf("PluginNodeID is required (e.g., 'plugin_nube.plm')")
	}

	// Step 1: Ensure service root exists under plugin node
	serviceID, err := EnsureNode(ctx, client, spec.ServiceNode, spec.PluginNodeID)
	if err != nil {
		return nil, fmt.Errorf("ensure service root: %w", err)
	}

	// Step 2: Ensure collections exist under service
	collectionIDs := make(map[string]string)
	for _, col := range spec.Collections {
		colID, err := EnsureNode(ctx, client, col, serviceID)
		if err != nil {
			return nil, fmt.Errorf("ensure collection %s: %w", col.Type, err)
		}
		collectionIDs[col.Type] = colID
	}

	return &HierarchyResult{
		ServiceID:     serviceID,
		CollectionIDs: collectionIDs,
	}, nil
}

// queryNodes sends NATS query request and returns nodes
func queryNodes(ctx context.Context, client *Client, filter string) ([]NodeResponse, error) {
	subject := client.Subject.Build("query", "create")

	// Extract org and device IDs from subject builder
	tempSubject := client.Subject.Build()
	parts := strings.Split(tempSubject, ".")
	if len(parts) < 5 {
		return nil, fmt.Errorf("invalid subject format: %s", tempSubject)
	}
	orgID := parts[3]
	deviceID := parts[4]

	// Wrap in NATS envelope (required by gateway's NATS subscriber)
	envelope := map[string]interface{}{
		"method": "POST",
		"path":   fmt.Sprintf("/api/v1/orgs/%s/devices/%s/query", orgID, deviceID),
		"params": map[string]string{
			"orgId":    orgID,
			"deviceId": deviceID,
		},
		"body": map[string]interface{}{
			"filter": filter,
		},
	}

	reqData, err := json.Marshal(envelope)
	if err != nil {
		return nil, err
	}

	respData, err := client.NC.Request(subject, reqData, 5*time.Second)
	if err != nil {
		return nil, err
	}

	// NATS response wraps HTTP response: {"data": {"data": [...], "meta": {...}}, "status": 200}
	var natsResponse struct {
		Data struct {
			Data []NodeResponse         `json:"data"`
			Meta map[string]interface{} `json:"meta"`
		} `json:"data"`
		Status int `json:"status"`
	}
	if err := json.Unmarshal(respData, &natsResponse); err != nil {
		return nil, err
	}

	return natsResponse.Data.Data, nil
}

// createNode sends NATS create request and returns node ID
func createNode(ctx context.Context, client *Client, spec NodeSpec, parentID string) (string, error) {
	subject := client.Subject.Build("nodes", "create")

	// Build node payload
	node := map[string]interface{}{
		"type":     spec.Type,
		"name":     spec.Name,
		"settings": spec.Settings,
	}

	if parentID != "" {
		node["parentId"] = parentID
		// Include parentRef in refs array (required for proper hierarchy)
		node["refs"] = []map[string]interface{}{
			{
				"refName":  "parentRef",
				"toNodeId": parentID,
			},
		}
	}

	// Merge description into settings if provided
	if spec.Description != "" {
		if node["settings"] == nil {
			node["settings"] = make(map[string]interface{})
		}
		node["settings"].(map[string]interface{})["description"] = spec.Description
	}

	// Get orgId and deviceId from subject builder
	// Subject format: rubix.v1.local.{orgId}.{deviceId}.*.nodes.create
	// Parse the base subject to extract org and device IDs
	tempSubject := client.Subject.Build()
	parts := strings.Split(tempSubject, ".")
	if len(parts) < 5 {
		return "", fmt.Errorf("invalid subject format: %s", tempSubject)
	}
	orgID := parts[3]
	deviceID := parts[4]

	// Wrap in NATS envelope (required by gateway's NATS subscriber)
	envelope := map[string]interface{}{
		"method": "POST",
		"path":   fmt.Sprintf("/api/v1/orgs/%s/devices/%s/nodes", orgID, deviceID),
		"params": map[string]string{
			"orgId":    orgID,
			"deviceId": deviceID,
		},
		"body": node,
	}

	reqData, err := json.Marshal(envelope)
	if err != nil {
		return "", err
	}

	respData, err := client.NC.Request(subject, reqData, 5*time.Second)
	if err != nil {
		return "", fmt.Errorf("NATS request failed: %w", err)
	}

	// NATS response wraps HTTP response: {"data": {"data": {...}, "meta": {...}}, "status": 201}
	var natsResponse struct {
		Data struct {
			Data NodeResponse          `json:"data"`
			Meta map[string]interface{} `json:"meta"`
		} `json:"data"`
		Status int `json:"status"`
	}
	if err := json.Unmarshal(respData, &natsResponse); err != nil {
		return "", fmt.Errorf("failed to parse response: %w (response: %s)", err, string(respData))
	}

	if natsResponse.Data.Data.ID == "" {
		return "", fmt.Errorf("response contained empty ID (full response: %s)", string(respData))
	}

	return natsResponse.Data.Data.ID, nil
}

// NodeResponse matches the node structure returned by NATS API
type NodeResponse struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"`
	Name     string                 `json:"name"`
	ParentID string                 `json:"parentId,omitempty"`
	Settings map[string]interface{} `json:"settings,omitempty"`
}
