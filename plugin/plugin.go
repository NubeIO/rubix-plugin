package plugin

// Manifest mirrors the plugin.json format.
// Plugins use this to describe themselves; rubix reads it to discover them.
type Manifest struct {
	ID          string   `json:"id"`                    // e.g. "nube.projectmgmt"
	Vendor      string   `json:"vendor"`                // e.g. "nube"
	Name        string   `json:"name"`                  // e.g. "projectmgmt"
	DisplayName string   `json:"displayName"`           // human-readable
	Version     string   `json:"version"`               // semver e.g. "1.0.0"
	Description string   `json:"description,omitempty"` // short description
	NodeTypes   []string `json:"nodeTypes"`             // empty for app-only plugins

	// HTTPPort is the port this plugin's HTTP server listens on.
	// Set to 0 if the plugin does not expose an HTTP API.
	// Rubix will proxy /api/v1/ext/<name>/* to http://localhost:<HTTPPort>/*
	HTTPPort int `json:"httpPort,omitempty"`

	Enabled bool `json:"enabled"`
}
