package nodehooks

// Node is a simplified version of a node for plugin communication
// This is passed to plugins for validation and transformation
type Node struct {
	ID       string         `json:"id"`
	ParentID string         `json:"parentId,omitempty"`
	Type     string         `json:"type"`
	Name     string         `json:"name"`
	Settings map[string]any `json:"settings,omitempty"`
	PluginID string         `json:"pluginId,omitempty"`
}

// ============================================================================
// CREATE Hooks
// ============================================================================

// BeforeCreateRequest is sent to the plugin before a node is created
type BeforeCreateRequest struct {
	Node    Node           `json:"node"`
	UserID  string         `json:"userId,omitempty"`
	OrgID   string         `json:"orgId"`
	Context map[string]any `json:"context,omitempty"`
}

// BeforeCreateResponse allows the plugin to allow/block/modify the creation
type BeforeCreateResponse struct {
	Allow    bool     `json:"allow"`                // false = block creation
	Reason   string   `json:"reason,omitempty"`     // Why it was blocked
	Modified *Node    `json:"modified,omitempty"`   // Modified node to use instead
	Warnings []string `json:"warnings,omitempty"`   // Non-blocking warnings
}

// AfterCreateRequest is sent to the plugin after a node is successfully created
type AfterCreateRequest struct {
	Node  Node   `json:"node"`
	OrgID string `json:"orgId"`
}

// AfterCreateResponse is the response from afterCreate hook
// Currently no-op, reserved for future use
type AfterCreateResponse struct {
	// Reserved for future use
}

// ============================================================================
// UPDATE Hooks
// ============================================================================

// BeforeUpdateRequest is sent to the plugin before a node is updated
type BeforeUpdateRequest struct {
	OldNode Node           `json:"oldNode"`
	NewNode Node           `json:"newNode"`
	UserID  string         `json:"userId,omitempty"`
	OrgID   string         `json:"orgId"`
	Context map[string]any `json:"context,omitempty"`
}

// BeforeUpdateResponse allows the plugin to allow/block/modify the update
type BeforeUpdateResponse struct {
	Allow    bool     `json:"allow"`
	Reason   string   `json:"reason,omitempty"`
	Modified *Node    `json:"modified,omitempty"`
	Warnings []string `json:"warnings,omitempty"`
}

// AfterUpdateRequest is sent to the plugin after a node is successfully updated
type AfterUpdateRequest struct {
	OldNode Node   `json:"oldNode"`
	NewNode Node   `json:"newNode"`
	OrgID   string `json:"orgId"`
}

// AfterUpdateResponse is the response from afterUpdate hook
type AfterUpdateResponse struct {
	// Reserved for future use
}

// ============================================================================
// DELETE Hooks
// ============================================================================

// BeforeDeleteRequest is sent to the plugin before a node is deleted
type BeforeDeleteRequest struct {
	Node    Node           `json:"node"`
	UserID  string         `json:"userId,omitempty"`
	OrgID   string         `json:"orgId"`
	Context map[string]any `json:"context,omitempty"`
}

// BeforeDeleteResponse allows the plugin to allow/block the deletion
type BeforeDeleteResponse struct {
	Allow    bool     `json:"allow"`
	Reason   string   `json:"reason,omitempty"`
	Warnings []string `json:"warnings,omitempty"`
}

// AfterDeleteRequest is sent to the plugin after a node is successfully deleted
type AfterDeleteRequest struct {
	Node  Node   `json:"node"`
	OrgID string `json:"orgId"`
}

// AfterDeleteResponse is the response from afterDelete hook
type AfterDeleteResponse struct {
	// Reserved for future use
}
