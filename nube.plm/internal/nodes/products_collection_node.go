package nodes

import (
	"context"

	"github.com/NubeIO/rubix-plugin/nodedeps"
	"github.com/NubeIO/rubix-plugin/pluginnode"
)

// ProductsCollectionNode is the products container (singleton under service)
// Acts as a "table" that contains all product "rows"
type ProductsCollectionNode struct {
	NodeID   string
	Settings map[string]interface{}
}

func (n *ProductsCollectionNode) Init(spec pluginnode.NodeSpec) error {
	n.NodeID = spec.ID
	n.Settings = spec.Settings
	return nil
}

func (n *ProductsCollectionNode) Close() error {
	return nil
}

func (n *ProductsCollectionNode) GetPorts() ([]pluginnode.NodePort, []pluginnode.NodePort) {
	return nil, nil // No ports - organizational node
}

func (n *ProductsCollectionNode) OnInputUpdated(portID string, val pluginnode.PortValue) {}

func (n *ProductsCollectionNode) Process(ctx context.Context, inputs map[string]pluginnode.PortValue) (map[string]pluginnode.PortValue, error) {
	return nil, nil
}

// GetConstraints defines products collection as singleton under service
func (n *ProductsCollectionNode) GetConstraints() nodedeps.NodeConstraints {
	return nodedeps.NodeConstraints{
		MaxOneNode:          true, // Only one products collection
		DeletionProhibited:  false,
		AllowCascadeDelete:  true, // Delete all child products
		MustLiveUnderParent: true,
		AllowedParents:      []string{"plm.service"},
	}
}
