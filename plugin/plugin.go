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

	// Pages are frontend pages contributed by this plugin.
	// These appear in the right-click "Page Views" dropdown.
	Pages []PageDef `json:"pages,omitempty"`

	// Widgets are dashboard widgets contributed by this plugin.
	// These appear in the scene-builder widget palette.
	Widgets []WidgetDef `json:"widgets,omitempty"`

	Enabled bool `json:"enabled"`
}

// PageDef declares a frontend page.
type PageDef struct {
	PageID      string                 `json:"pageId"`
	Title       string                 `json:"title"`
	Icon        string                 `json:"icon,omitempty"`
	Description string                 `json:"description,omitempty"`
	Enabled     bool                   `json:"enabled"`
	IsDefault   bool                   `json:"isDefault,omitempty"`
	Order       int                    `json:"order,omitempty"`
	Props       map[string]interface{} `json:"props,omitempty"`
}

// WidgetDef declares a dashboard widget.
type WidgetDef struct {
	ID              string                 `json:"id"`
	DisplayName     string                 `json:"displayName"`
	Description     string                 `json:"description,omitempty"`
	ModuleID        string                 `json:"moduleId"` // Module Federation export path (e.g., "./Widget")
	Category        string                 `json:"category,omitempty"`
	Icon            string                 `json:"icon,omitempty"`
	SupportsQuery   bool                   `json:"supportsQuery"`   // Type A: can use Source Query
	RequiresBackend bool                   `json:"requiresBackend"` // Type B: needs backend calls
	DefaultSize     *WidgetSize            `json:"defaultSize,omitempty"`
	Props           map[string]interface{} `json:"props,omitempty"`
}

// WidgetSize defines default widget dimensions.
type WidgetSize struct {
	W int `json:"w"` // Width in grid units
	H int `json:"h"` // Height in grid units
}
