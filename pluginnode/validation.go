package pluginnode

import (
	"fmt"

	"github.com/xeipuuv/gojsonschema"
)

// SettingsValidator validates settings against a JSON schema.
type SettingsValidator struct {
	schema *gojsonschema.Schema
}

// NewSettingsValidator creates a validator from a JSON schema map.
// Returns nil validator (not error) if schemaMap is nil or empty - graceful degradation.
func NewSettingsValidator(schemaMap map[string]interface{}) (*SettingsValidator, error) {
	if schemaMap == nil || len(schemaMap) == 0 {
		return &SettingsValidator{schema: nil}, nil // No schema = no validation
	}

	loader := gojsonschema.NewGoLoader(schemaMap)
	schema, err := gojsonschema.NewSchema(loader)
	if err != nil {
		return nil, fmt.Errorf("invalid schema: %w", err)
	}
	return &SettingsValidator{schema: schema}, nil
}

// Validate checks settings against the schema.
// Returns nil if no schema is set (graceful degradation).
func (v *SettingsValidator) Validate(settings map[string]interface{}) error {
	if v.schema == nil {
		return nil // No schema = no validation
	}

	// Allow nil/empty settings if they pass the schema (e.g., all fields have defaults)
	if settings == nil {
		settings = make(map[string]interface{})
	}

	docLoader := gojsonschema.NewGoLoader(settings)
	result, err := v.schema.Validate(docLoader)
	if err != nil {
		return fmt.Errorf("validation error: %w", err)
	}

	if !result.Valid() {
		// Collect all validation errors
		var errors []string
		for _, desc := range result.Errors() {
			errors = append(errors, desc.String())
		}
		return &SettingsValidationError{Errors: errors}
	}

	return nil
}

// SettingsValidationError contains all validation failures.
type SettingsValidationError struct {
	Errors []string
}

func (e *SettingsValidationError) Error() string {
	if len(e.Errors) == 1 {
		return e.Errors[0]
	}
	return fmt.Sprintf("%d validation errors: %v", len(e.Errors), e.Errors)
}
