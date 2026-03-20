package bootstrap

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

// EnsureNode gets existing node or creates it (idempotent)
// Returns node ID on success
func EnsureNode(ctx context.Context, client *Client, spec NodeSpec, parentID string) (string, error) {
	// Step 1: Query for existing node
	filter := fmt.Sprintf(`type is "%s"`, spec.Type)
	if parentID != "" {
		filter += fmt.Sprintf(` and parentRef is "%s"`, parentID)
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
	// Step 1: Ensure service root exists
	serviceID, err := EnsureNode(ctx, client, spec.ServiceNode, "")
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
	// Query uses RAS routing: {prefix}.{orgId}.{deviceId}.query (NO flowId)
	subject := fmt.Sprintf("%s.%s.%s.query",
		client.Subject.(*natssubject.Builder).GetPrefix(),
		client.Subject.(*natssubject.Builder).GetOrgID(),
		client.Subject.(*natssubject.Builder).GetDeviceID())

	reqData, err := json.Marshal(map[string]interface{}{
		"filter": filter,
	})
	if err != nil {
		return nil, err
	}

	respData, err := client.NC.Request(subject, reqData, 5*time.Second)
	if err != nil {
		return nil, err
	}

	var result struct {
		Data []NodeResponse `json:"data"`
	}
	if err := json.Unmarshal(respData, &result); err != nil {
		return nil, err
	}

	return result.Data, nil
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
	}

	// Merge description into settings if provided
	if spec.Description != "" {
		if node["settings"] == nil {
			node["settings"] = make(map[string]interface{})
		}
		node["settings"].(map[string]interface{})["description"] = spec.Description
	}

	reqData, err := json.Marshal(node)
	if err != nil {
		return "", err
	}

	// DEBUG: Log request
	fmt.Printf("[BOOTSTRAP DEBUG] Creating node: type=%s, subject=%s, payload=%s\n", spec.Type, subject, string(reqData))

	respData, err := client.NC.Request(subject, reqData, 5*time.Second)
	if err != nil {
		return "", fmt.Errorf("NATS request failed: %w", err)
	}

	// DEBUG: Log response
	fmt.Printf("[BOOTSTRAP DEBUG] Response: %s\n", string(respData))

	var result struct {
		Data NodeResponse `json:"data"`
	}
	if err := json.Unmarshal(respData, &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %w (response: %s)", err, string(respData))
	}

	// DEBUG: Log parsed ID
	fmt.Printf("[BOOTSTRAP DEBUG] Parsed ID: %s\n", result.Data.ID)

	if result.Data.ID == "" {
		return "", fmt.Errorf("response contained empty ID (full response: %s)", string(respData))
	}

	return result.Data.ID, nil
}

// NodeResponse matches the node structure returned by NATS API
type NodeResponse struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"`
	Name     string                 `json:"name"`
	ParentID string                 `json:"parentId,omitempty"`
	Settings map[string]interface{} `json:"settings,omitempty"`
}
