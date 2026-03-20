package nodes

import (
	"context"

	"github.com/NubeIO/rubix-plugin/nodedeps"
	"github.com/NubeIO/rubix-plugin/pluginnode"
)

// PLMServiceNode is the root service node (singleton)
// Owns all PLM data: products, production runs, serialized units, etc.
type PLMServiceNode struct {
	NodeID   string
	Settings map[string]interface{}
}

func (n *PLMServiceNode) Init(spec pluginnode.NodeSpec) error {
	n.NodeID = spec.ID
	n.Settings = spec.Settings
	return nil
}

func (n *PLMServiceNode) Close() error {
	return nil
}

func (n *PLMServiceNode) GetPorts() ([]pluginnode.NodePort, []pluginnode.NodePort) {
	return nil, nil // No ports - organizational node
}

func (n *PLMServiceNode) OnInputUpdated(portID string, val pluginnode.PortValue) {}

func (n *PLMServiceNode) Process(ctx context.Context, inputs map[string]pluginnode.PortValue) (map[string]pluginnode.PortValue, error) {
	return nil, nil
}

// GetConstraints defines PLM service as singleton root
func (n *PLMServiceNode) GetConstraints() nodedeps.NodeConstraints {
	return nodedeps.NodeConstraints{
		MaxOneNode:          true,  // Only one PLM service per device
		DeletionProhibited:  false, // Can delete (removes all PLM data)
		AllowCascadeDelete:  true,  // Delete all collections + records
		MustLiveUnderParent: true,
		AllowedParents:      []string{"rubix.device"},
	}
}
