package nodehooks

import "context"

// NodeHooks is the interface that plugins implement to control CRUD operations
// on their node types.
//
// Plugins can choose which hooks to implement:
//   - BeforeCreate/Update/Delete: Validate, transform, or block operations
//   - AfterCreate/Update/Delete: React to successful operations (logging, notifications, etc.)
//
// All hooks are optional. If a plugin doesn't implement a hook, the operation proceeds normally.
type NodeHooks interface {
	// BeforeCreate is called before a node is created
	// Return error to block creation with an error message
	// Return BeforeCreateResponse with Allow=false to block with a custom reason
	// Return Modified node to transform the node before creation
	BeforeCreate(ctx context.Context, req *BeforeCreateRequest) (*BeforeCreateResponse, error)

	// AfterCreate is called after a node is successfully created
	// This is best-effort - errors are logged but don't affect the creation
	AfterCreate(ctx context.Context, req *AfterCreateRequest) (*AfterCreateResponse, error)

	// BeforeUpdate is called before a node is updated
	// Return error to block update with an error message
	// Return BeforeUpdateResponse with Allow=false to block with a custom reason
	// Return Modified node to transform the node before update
	BeforeUpdate(ctx context.Context, req *BeforeUpdateRequest) (*BeforeUpdateResponse, error)

	// AfterUpdate is called after a node is successfully updated
	// This is best-effort - errors are logged but don't affect the update
	AfterUpdate(ctx context.Context, req *AfterUpdateRequest) (*AfterUpdateResponse, error)

	// BeforeDelete is called before a node is deleted
	// Return error to block deletion with an error message
	// Return BeforeDeleteResponse with Allow=false to block with a custom reason
	BeforeDelete(ctx context.Context, req *BeforeDeleteRequest) (*BeforeDeleteResponse, error)

	// AfterDelete is called after a node is successfully deleted
	// This is best-effort - errors are logged but don't affect the deletion
	AfterDelete(ctx context.Context, req *AfterDeleteRequest) (*AfterDeleteResponse, error)
}

// NoOpHooks provides a default implementation that allows all operations
// Plugins can embed this and override only the hooks they need
type NoOpHooks struct{}

func (h *NoOpHooks) BeforeCreate(ctx context.Context, req *BeforeCreateRequest) (*BeforeCreateResponse, error) {
	return &BeforeCreateResponse{Allow: true}, nil
}

func (h *NoOpHooks) AfterCreate(ctx context.Context, req *AfterCreateRequest) (*AfterCreateResponse, error) {
	return &AfterCreateResponse{}, nil
}

func (h *NoOpHooks) BeforeUpdate(ctx context.Context, req *BeforeUpdateRequest) (*BeforeUpdateResponse, error) {
	return &BeforeUpdateResponse{Allow: true}, nil
}

func (h *NoOpHooks) AfterUpdate(ctx context.Context, req *AfterUpdateRequest) (*AfterUpdateResponse, error) {
	return &AfterUpdateResponse{}, nil
}

func (h *NoOpHooks) BeforeDelete(ctx context.Context, req *BeforeDeleteRequest) (*BeforeDeleteResponse, error) {
	return &BeforeDeleteResponse{Allow: true}, nil
}

func (h *NoOpHooks) AfterDelete(ctx context.Context, req *AfterDeleteRequest) (*AfterDeleteResponse, error) {
	return &AfterDeleteResponse{}, nil
}
