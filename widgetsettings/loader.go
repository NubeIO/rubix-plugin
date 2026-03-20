package widgetsettings

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// WidgetSettingsYAML represents the YAML structure for widget settings
type WidgetSettingsYAML struct {
	Schema   map[string]interface{} `yaml:"schema"`
	Defaults map[string]interface{} `yaml:"defaults,omitempty"`
	Examples map[string]interface{} `yaml:"examples,omitempty"`
}

// LoadFromFile reads a widget settings YAML file and returns the JSON Schema
func LoadFromFile(filePath string) (map[string]interface{}, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read settings file: %w", err)
	}

	var settings WidgetSettingsYAML
	if err := yaml.Unmarshal(data, &settings); err != nil {
		return nil, fmt.Errorf("failed to parse YAML: %w", err)
	}

	if settings.Schema == nil {
		return nil, fmt.Errorf("settings file missing 'schema' field")
	}

	return settings.Schema, nil
}

// LoadFromBytes reads widget settings from YAML bytes
func LoadFromBytes(data []byte) (map[string]interface{}, error) {
	var settings WidgetSettingsYAML
	if err := yaml.Unmarshal(data, &settings); err != nil {
		return nil, fmt.Errorf("failed to parse YAML: %w", err)
	}

	if settings.Schema == nil {
		return nil, fmt.Errorf("settings YAML missing 'schema' field")
	}

	return settings.Schema, nil
}

// GetDefaults returns the default values from settings YAML
func GetDefaults(filePath string) (map[string]interface{}, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read settings file: %w", err)
	}

	var settings WidgetSettingsYAML
	if err := yaml.Unmarshal(data, &settings); err != nil {
		return nil, fmt.Errorf("failed to parse YAML: %w", err)
	}

	return settings.Defaults, nil
}
