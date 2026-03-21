package bootstrap

import (
	"context"
	"fmt"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
)

// WaitForServer waits for rubix core to be ready (delegates to natslib)
// Deprecated: Use natslib.Client.WaitForServer directly for more control
func WaitForServer(ctx context.Context, client *Client, maxWait time.Duration, onRetry func(attempt int, nextDelay time.Duration)) error {
	subject := client.Subject.Build("query", "create")
	return client.NC.WaitForServer(ctx, natslib.WaitForServerOpts{
		Subject: subject,
		MaxWait: maxWait,
		OnRetry: onRetry,
	})
}

// EnsureHierarchyWithRetry attempts to create hierarchy, retrying if server is not ready
// This is the recommended way to bootstrap from plugin main.go
func EnsureHierarchyWithRetry(ctx context.Context, client *Client, spec HierarchySpec, maxWait time.Duration, onRetry func(attempt int, nextDelay time.Duration)) (*HierarchyResult, error) {
	// First, wait for server to be ready
	if err := WaitForServer(ctx, client, maxWait, onRetry); err != nil {
		return nil, fmt.Errorf("server not ready: %w", err)
	}

	// Server is ready, proceed with hierarchy creation
	return EnsureHierarchy(ctx, client, spec)
}
