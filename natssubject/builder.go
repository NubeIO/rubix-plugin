package natssubject

import (
	"fmt"
	"strings"
)

// Builder constructs NATS subjects consistently for both server and client
// Subject format: {prefix}.{orgId}.{deviceId}.{flowId}.{resource}.{action}
// Example: rubix.v1.local.org1.device0.main.nodes.list
type Builder struct {
	prefix   string // "rubix.v1.local" or "rubix.v1.global"
	orgID    string
	deviceID string
	flowID   string
}

// NewBuilder creates a new NATS subject builder
func NewBuilder(prefix, orgID, deviceID, flowID string) *Builder {
	return &Builder{
		prefix:   prefix,
		orgID:    orgID,
		deviceID: deviceID,
		flowID:   flowID,
	}
}

// Build creates a complete NATS subject for publishing
// Accepts a variable number of path segments (resource, action, and optional additional segments)
//
// Examples:
//   Build("nodes", "list") -> rubix.v1.local.org1.device0.main.nodes.list
//   Build("nodes", "get") -> rubix.v1.local.org1.device0.main.nodes.get
//   Build("query") -> rubix.v1.local.org1.device0.main.query
//
func (b *Builder) Build(parts ...string) string {
	if len(parts) == 0 {
		return fmt.Sprintf("%s.%s.%s.%s",
			b.prefix,
			b.orgID,
			b.deviceID,
			b.flowID,
		)
	}

	// Start with base: prefix.orgId.deviceId.flowId
	base := []string{b.prefix, b.orgID, b.deviceID, b.flowID}

	// Append all additional parts
	allParts := append(base, parts...)

	return strings.Join(allParts, ".")
}

// BuildSubscription creates a subscription pattern for the server
// Returns: {prefix}.{orgId}.{deviceId}.{flowId}.>
// The ">" wildcard matches all resources and actions
func (b *Builder) BuildSubscription() string {
	return fmt.Sprintf("%s.%s.%s.%s.>",
		b.prefix,
		b.orgID,
		b.deviceID,
		b.flowID,
	)
}

// Parse extracts resource and action from a complete NATS subject
// The subject format is: {prefix(3)}.{orgId}.{deviceId}.{flowId}.{resource...}.{action}
// The first 6 parts are fixed (e.g., rubix.v1.local.org1.device0.main),
// everything between index 6 and the last part is the resource (may contain dots),
// and the last part is the action.
//
// Examples:
//   rubix.v1.local.org1.device0.main.flows.create → resource="flows", action="create"
//   rubix.v1.local.org1.device0.main.nodes.pages.get-node-pages → resource="nodes.pages", action="get-node-pages"
func Parse(subject string) (resource, action string, err error) {
	parts := strings.Split(subject, ".")

	// Minimum: prefix(3) + orgId + deviceId + flowId + resource + action = 8
	if len(parts) < 8 {
		return "", "", fmt.Errorf("invalid subject format: %s (need at least 8 parts: prefix.orgId.deviceId.flowId.resource.action)", subject)
	}

	// Parts 0-5 are fixed header, last part is action, everything in between is resource
	const headerLen = 6
	action = parts[len(parts)-1]
	resource = strings.Join(parts[headerLen:len(parts)-1], ".")

	return resource, action, nil
}

// ParseFull extracts all components from a complete NATS subject
// Input: rubix.v1.local.org1.device0.main.flows.create
// Output: Components struct with all fields populated
func ParseFull(subject string) (*Components, error) {
	parts := strings.Split(subject, ".")

	// Minimum parts: prefix(3) + orgId + deviceId + flowId + resource + action = 8
	// Example: rubix.v1.local.org1.device0.main.flows.create
	if len(parts) < 8 {
		return nil, fmt.Errorf("invalid subject format: %s (expected at least 8 parts)", subject)
	}

	// Reconstruct prefix (first 3 parts: rubix.v1.local)
	prefix := strings.Join(parts[0:3], ".")

	return &Components{
		Prefix:   prefix,
		OrgID:    parts[3],
		DeviceID: parts[4],
		FlowID:   parts[5],
		Resource: strings.Join(parts[6:len(parts)-1], "."),
		Action:   parts[len(parts)-1],
	}, nil
}

// Components holds all parts of a NATS subject
type Components struct {
	Prefix   string // "rubix.v1.local" or "rubix.v1.global"
	OrgID    string
	DeviceID string
	FlowID   string
	Resource string
	Action   string
}

// Validate checks if a subject matches the expected format
func Validate(subject string) error {
	parts := strings.Split(subject, ".")

	if len(parts) < 8 {
		return fmt.Errorf("invalid subject: expected at least 8 parts, got %d", len(parts))
	}

	// Check prefix format (rubix.v1.{scope})
	if parts[0] != "rubix" {
		return fmt.Errorf("invalid subject: expected prefix to start with 'rubix', got '%s'", parts[0])
	}

	if parts[1] != "v1" {
		return fmt.Errorf("invalid subject: expected version 'v1', got '%s'", parts[1])
	}

	scope := parts[2]
	if scope != "local" && scope != "global" {
		return fmt.Errorf("invalid subject: scope must be 'local' or 'global', got '%s'", scope)
	}

	return nil
}
