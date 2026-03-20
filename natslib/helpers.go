package natslib

import (
	"github.com/NubeIO/rubix-plugin/natssubject"
)

// PluginClient combines a NATS client with a subject builder for convenience
type PluginClient struct {
	*Client
	Subject *natssubject.Builder
}

// NewPluginClient creates a plugin client with NATS connection and subject builder
// prefix is typically "rubix.v1.local" or "rubix.v1.global"
func NewPluginClient(natsURL, prefix, orgID, deviceID, flowID string) (*PluginClient, error) {
	client, err := Connect(natsURL)
	if err != nil {
		return nil, err
	}

	sb := natssubject.NewBuilder(prefix, orgID, deviceID, flowID)

	return &PluginClient{
		Client:  client,
		Subject: sb,
	}, nil
}
