package nodes

import (
	"context"

	"github.com/NubeIO/rubix-plugin/pluginnode"
)

// ProductNode represents a PLM product node
// Phase 1: Passive data node - no inputs/outputs, just stores settings
type ProductNode struct {
	NodeID   string
	Settings map[string]interface{}
}

// Init initializes the product node
func (n *ProductNode) Init(spec pluginnode.NodeSpec) error {
	n.NodeID = spec.ID
	n.Settings = spec.Settings
	return nil
}

// Close cleans up resources
func (n *ProductNode) Close() error {
	return nil
}

// GetPorts returns the input and output port definitions
// Phase 1: No ports needed - products are passive data nodes
func (n *ProductNode) GetPorts() (inputs []pluginnode.NodePort, outputs []pluginnode.NodePort) {
	return nil, nil
}

// OnInputUpdated is called when an input port is updated
func (n *ProductNode) OnInputUpdated(portID string, val pluginnode.PortValue) {
	// No inputs in Phase 1
}

// Process is called when an upstream value changes
func (n *ProductNode) Process(ctx context.Context, inputs map[string]pluginnode.PortValue) (map[string]pluginnode.PortValue, error) {
	// No processing needed in Phase 1
	return nil, nil
}

// SettingsSchema returns the JSON Schema for product settings
func (n *ProductNode) SettingsSchema() map[string]interface{} {
	return map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"productCode": map[string]interface{}{
				"type":        "string",
				"title":       "Product Code",
				"description": "Unique product identifier (SKU)",
			},
			"description": map[string]interface{}{
				"type":        "string",
				"title":       "Description",
				"description": "Product description",
			},
			"status": map[string]interface{}{
				"type":        "string",
				"title":       "Status",
				"description": "Product lifecycle status",
				"enum":        []interface{}{"Design", "Prototype", "Production", "Discontinued"},
				"default":     "Design",
			},
			"price": map[string]interface{}{
				"type":        "number",
				"title":       "Price",
				"description": "Product price",
				"minimum":     0,
			},
		},
	}
}
