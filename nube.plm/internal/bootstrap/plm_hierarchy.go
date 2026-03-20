package bootstrap

import (
	"context"
	"fmt"
	"time"

	pluginBootstrap "github.com/NubeIO/rubix-plugin/bootstrap"
)

// EnsurePLMHierarchy creates PLM service + collections (idempotent)
// Returns map of collection IDs: {"service": "...", "products": "...", "productionRuns": "..."}
func EnsurePLMHierarchy(ctx context.Context, client *pluginBootstrap.Client) (map[string]string, error) {
	spec := pluginBootstrap.HierarchySpec{
		ServiceNode: pluginBootstrap.NodeSpec{
			Type: "plm.service",
			Name: "PLM System",
			Settings: map[string]interface{}{
				"description": "Product Lifecycle Management",
				"version":     "1.0.0",
			},
		},
		Collections: []pluginBootstrap.NodeSpec{
			{
				Type: "plm.products",
				Name: "Products",
				Settings: map[string]interface{}{
					"description": "Product definitions",
				},
			},
			// TODO: Uncomment when ready to test other collections
			// {
			// 	Type: "plm.production-runs",
			// 	Name: "Production Runs",
			// 	Settings: map[string]interface{}{
			// 		"description": "Manufacturing runs",
			// 	},
			// },
			// {
			// 	Type: "plm.serialized-units",
			// 	Name: "Serialized Units",
			// 	Settings: map[string]interface{}{
			// 		"description": "Individual units with serial numbers",
			// 	},
			// },
			// {
			// 	Type: "plm.work-items",
			// 	Name: "Work Items",
			// 	Settings: map[string]interface{}{
			// 		"description": "RMA, bugs, feature requests",
			// 	},
			// },
			// {
			// 	Type: "plm.sites",
			// 	Name: "Sites",
			// 	Settings: map[string]interface{}{
			// 		"description": "Customer installation sites",
			// 	},
			// },
		},
	}

	result, err := pluginBootstrap.EnsureHierarchy(ctx, client, spec)
	if err != nil {
		return nil, err
	}

	// Return map for easy lookup
	return map[string]string{
		"service":  result.ServiceID,
		"products": result.CollectionIDs["plm.products"],
		// TODO: Uncomment when other collections are enabled
		// "productionRuns":  result.CollectionIDs["plm.production-runs"],
		// "serializedUnits": result.CollectionIDs["plm.serialized-units"],
		// "workItems":       result.CollectionIDs["plm.work-items"],
		// "sites":           result.CollectionIDs["plm.sites"],
	}, nil
}

// EnsurePLMHierarchyWithRetry creates PLM hierarchy with retry (waits for rubix core)
func EnsurePLMHierarchyWithRetry(ctx context.Context, client *pluginBootstrap.Client, maxWait time.Duration, onRetry func(attempt int, nextDelay time.Duration)) (map[string]string, error) {
	spec := pluginBootstrap.HierarchySpec{
		ServiceNode: pluginBootstrap.NodeSpec{
			Type: "plm.service",
			Name: "PLM System",
			Settings: map[string]interface{}{
				"description": "Product Lifecycle Management",
				"version":     "1.0.0",
			},
		},
		Collections: []pluginBootstrap.NodeSpec{
			{
				Type: "plm.products",
				Name: "Products",
				Settings: map[string]interface{}{
					"description": "Product definitions",
				},
			},
		},
	}

	result, err := pluginBootstrap.EnsureHierarchyWithRetry(ctx, client, spec, maxWait, onRetry)
	if err != nil {
		return nil, err
	}

	// Extract IDs
	serviceID := result.ServiceID
	productsID := result.CollectionIDs["plm.products"]

	// Debug: log what we got
	if serviceID == "" {
		return nil, fmt.Errorf("bootstrap returned empty service ID")
	}
	if productsID == "" {
		return nil, fmt.Errorf("bootstrap returned empty products collection ID")
	}

	return map[string]string{
		"service":  serviceID,
		"products": productsID,
	}, nil
}

