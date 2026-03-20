package hooks

import (
	"context"
	"fmt"

	"github.com/NubeIO/rubix-plugin/nodehooks"
	"github.com/rs/zerolog/log"
)

// PLMNodeHooks implements the nodehooks.NodeHooks interface for PLM plugin
// This controls CRUD operations on PLM node types (plm.product, plm.project, plm.task)
type PLMNodeHooks struct {
	nodehooks.NoOpHooks // Embed default implementations
}

// NewPLMNodeHooks creates a new PLM node hooks handler
func NewPLMNodeHooks() *PLMNodeHooks {
	return &PLMNodeHooks{}
}

// BeforeCreate validates a node before creation
func (h *PLMNodeHooks) BeforeCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
	switch req.Node.Type {
	case "plm.product":
		return h.validateProductCreate(ctx, req)
	case "plm.project":
		return h.validateProjectCreate(ctx, req)
	case "plm.task":
		return h.validateTaskCreate(ctx, req)
	default:
		// Unknown type, allow (should not happen if plugin.json is correct)
		return &nodehooks.BeforeCreateResponse{Allow: true}, nil
	}
}

// AfterCreate logs node creation
func (h *PLMNodeHooks) AfterCreate(ctx context.Context, req *nodehooks.AfterCreateRequest) (*nodehooks.AfterCreateResponse, error) {
	log.Info().
		Str("nodeId", req.Node.ID).
		Str("type", req.Node.Type).
		Str("name", req.Node.Name).
		Str("orgId", req.OrgID).
		Msg("PLM node created")

	// Future: Send notifications, update search index, etc.

	return &nodehooks.AfterCreateResponse{}, nil
}

// BeforeUpdate validates a node before update
func (h *PLMNodeHooks) BeforeUpdate(ctx context.Context, req *nodehooks.BeforeUpdateRequest) (*nodehooks.BeforeUpdateResponse, error) {
	switch req.NewNode.Type {
	case "plm.product":
		return h.validateProductUpdate(ctx, req)
	case "plm.project":
		return h.validateProjectUpdate(ctx, req)
	case "plm.task":
		return h.validateTaskUpdate(ctx, req)
	default:
		return &nodehooks.BeforeUpdateResponse{Allow: true}, nil
	}
}

// AfterUpdate logs node updates
func (h *PLMNodeHooks) AfterUpdate(ctx context.Context, req *nodehooks.AfterUpdateRequest) (*nodehooks.AfterUpdateResponse, error) {
	log.Info().
		Str("nodeId", req.NewNode.ID).
		Str("type", req.NewNode.Type).
		Str("orgId", req.OrgID).
		Msg("PLM node updated")

	return &nodehooks.AfterUpdateResponse{}, nil
}

// BeforeDelete validates a node before deletion
func (h *PLMNodeHooks) BeforeDelete(ctx context.Context, req *nodehooks.BeforeDeleteRequest) (*nodehooks.BeforeDeleteResponse, error) {
	// Example: Could check if product has active orders, projects have tasks, etc.
	log.Debug().
		Str("nodeId", req.Node.ID).
		Str("type", req.Node.Type).
		Msg("PLM node deletion requested")

	return &nodehooks.BeforeDeleteResponse{Allow: true}, nil
}

// AfterDelete logs node deletion
func (h *PLMNodeHooks) AfterDelete(ctx context.Context, req *nodehooks.AfterDeleteRequest) (*nodehooks.AfterDeleteResponse, error) {
	log.Info().
		Str("nodeId", req.Node.ID).
		Str("type", req.Node.Type).
		Str("orgId", req.OrgID).
		Msg("PLM node deleted")

	return &nodehooks.AfterDeleteResponse{}, nil
}

// ============================================================================
// Product Validation
// ============================================================================

func (h *PLMNodeHooks) validateProductCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
	// Validate required fields
	productCode, ok := req.Node.Settings["productCode"].(string)
	if !ok || productCode == "" {
		return &nodehooks.BeforeCreateResponse{
			Allow:  false,
			Reason: "productCode is required for plm.product nodes",
		}, nil
	}

	// Validate product code format (example: must start with letters)
	if len(productCode) < 3 {
		return &nodehooks.BeforeCreateResponse{
			Allow:  false,
			Reason: "productCode must be at least 3 characters",
		}, nil
	}

	// Validate status enum
	status, ok := req.Node.Settings["status"].(string)
	if ok && !isValidProductStatus(status) {
		return &nodehooks.BeforeCreateResponse{
			Allow:  false,
			Reason: fmt.Sprintf("invalid status '%s'. Must be: Design, Prototype, Production, or Discontinued", status),
		}, nil
	}

	// Validate price if provided
	if price, ok := req.Node.Settings["price"].(float64); ok {
		if price < 0 {
			return &nodehooks.BeforeCreateResponse{
				Allow:  false,
				Reason: "price cannot be negative",
			}, nil
		}
	}

	// TODO: Check uniqueness of productCode in database
	// For now, we don't have DB access in this example
	// exists := h.db.ProductCodeExists(ctx, productCode)

	warnings := []string{}
	if status == "" {
		warnings = append(warnings, "status not set, will default to 'Design'")
	}

	return &nodehooks.BeforeCreateResponse{
		Allow:    true,
		Warnings: warnings,
	}, nil
}

func (h *PLMNodeHooks) validateProductUpdate(ctx context.Context, req *nodehooks.BeforeUpdateRequest) (*nodehooks.BeforeUpdateResponse, error) {
	// Don't allow changing productCode after creation (immutable)
	oldCode, _ := req.OldNode.Settings["productCode"].(string)
	newCode, _ := req.NewNode.Settings["productCode"].(string)

	if oldCode != "" && newCode != oldCode {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: "productCode cannot be changed after creation",
		}, nil
	}

	// Validate status transitions
	oldStatus, _ := req.OldNode.Settings["status"].(string)
	newStatus, _ := req.NewNode.Settings["status"].(string)

	if oldStatus == "Discontinued" && newStatus != "Discontinued" {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: "cannot reactivate a discontinued product",
		}, nil
	}

	// Validate new status if changed
	if newStatus != "" && !isValidProductStatus(newStatus) {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: fmt.Sprintf("invalid status '%s'", newStatus),
		}, nil
	}

	// Validate price
	if price, ok := req.NewNode.Settings["price"].(float64); ok && price < 0 {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: "price cannot be negative",
		}, nil
	}

	return &nodehooks.BeforeUpdateResponse{Allow: true}, nil
}

// ============================================================================
// Project Validation
// ============================================================================

func (h *PLMNodeHooks) validateProjectCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
	// Example validation for projects
	projectCode, ok := req.Node.Settings["projectCode"].(string)
	if !ok || projectCode == "" {
		return &nodehooks.BeforeCreateResponse{
			Allow:  false,
			Reason: "projectCode is required for plm.project nodes",
		}, nil
	}

	return &nodehooks.BeforeCreateResponse{Allow: true}, nil
}

func (h *PLMNodeHooks) validateProjectUpdate(ctx context.Context, req *nodehooks.BeforeUpdateRequest) (*nodehooks.BeforeUpdateResponse, error) {
	// Example: Don't allow changing project code
	oldCode, _ := req.OldNode.Settings["projectCode"].(string)
	newCode, _ := req.NewNode.Settings["projectCode"].(string)

	if oldCode != "" && newCode != oldCode {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: "projectCode cannot be changed after creation",
		}, nil
	}

	return &nodehooks.BeforeUpdateResponse{Allow: true}, nil
}

// ============================================================================
// Task Validation
// ============================================================================

func (h *PLMNodeHooks) validateTaskCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
	// Example: Tasks must have a parent project
	if req.Node.ParentID == "" {
		return &nodehooks.BeforeCreateResponse{
			Allow:  false,
			Reason: "plm.task must have a parent project",
		}, nil
	}

	return &nodehooks.BeforeCreateResponse{Allow: true}, nil
}

func (h *PLMNodeHooks) validateTaskUpdate(ctx context.Context, req *nodehooks.BeforeUpdateRequest) (*nodehooks.BeforeUpdateResponse, error) {
	// Example: Don't allow moving tasks to different projects
	if req.OldNode.ParentID != req.NewNode.ParentID {
		return &nodehooks.BeforeUpdateResponse{
			Allow:  false,
			Reason: "tasks cannot be moved between projects",
		}, nil
	}

	return &nodehooks.BeforeUpdateResponse{Allow: true}, nil
}

// ============================================================================
// Helpers
// ============================================================================

func isValidProductStatus(status string) bool {
	validStatuses := map[string]bool{
		"Design":        true,
		"Prototype":     true,
		"Production":    true,
		"Discontinued":  true,
	}
	return validStatuses[status]
}
