package bootstrap

import (
	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/natssubject"
)

// Client wraps NATS client + subject builder for node operations
type Client struct {
	NC      *natslib.Client
	Subject *natssubject.Builder
}

// NodeSpec defines a node to create
type NodeSpec struct {
	Type        string                 `json:"type"`
	Name        string                 `json:"name"`
	Description string                 `json:"description,omitempty"`
	Settings    map[string]interface{} `json:"settings,omitempty"`
}

// HierarchySpec defines a complete service + collections hierarchy
type HierarchySpec struct {
	ServiceNode NodeSpec
	Collections []NodeSpec
}

// HierarchyResult contains the IDs of created nodes
type HierarchyResult struct {
	ServiceID     string            // ID of service root node
	CollectionIDs map[string]string // Map: collection type → node ID
}
