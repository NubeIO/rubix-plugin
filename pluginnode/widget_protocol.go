package pluginnode

// widget_protocol.go — NATS RPC types for plugin widgets.
//
// These types are shared between:
// - rubix (proxies HTTP → NATS)
// - external plugins (handle NATS widget calls)
//
// JSON field names MUST match for serialization to work.

// WidgetCallRequest is sent by rubix when a widget calls api.call(action, params).
// The plugin backend receives this via NATS subject:
//   {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.widgets.call.{widgetId}
type WidgetCallRequest struct {
	Action string                 `json:"action"`           // Action name (e.g., "getProjects", "createProject")
	Params map[string]interface{} `json:"params,omitempty"` // Action-specific parameters
	Meta   *WidgetCallMeta        `json:"meta,omitempty"`   // Optional metadata
}

// WidgetCallMeta contains optional metadata about the widget call.
type WidgetCallMeta struct {
	UserID    string `json:"userId,omitempty"`
	Timestamp string `json:"timestamp,omitempty"`
	WidgetID  string `json:"widgetId,omitempty"` // Which widget made the call
}

// WidgetCallResponse is what the plugin backend must return.
type WidgetCallResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *WidgetError `json:"error,omitempty"`
}

// WidgetError provides structured error information.
type WidgetError struct {
	Code    string                 `json:"code"`              // Error code (e.g., "VALIDATION_ERROR", "NOT_FOUND")
	Message string                 `json:"message"`           // Human-readable error message
	Details map[string]interface{} `json:"details,omitempty"` // Additional error context
}

// NOTE: Widget discovery (listing widgets, getting metadata) is done via filesystem.
// Rubix reads plugin.json directly from bin/orgs/{orgId}/plugins/{pluginName}/
// Only widget backend calls (Type B widgets) use NATS via WidgetCallRequest/Response.

// ============================================================
// Helper constructors
// ============================================================

// SuccessResponse creates a successful widget call response.
func SuccessResponse(data interface{}) WidgetCallResponse {
	return WidgetCallResponse{
		Success: true,
		Data:    data,
	}
}

// ErrorResponse creates a failed widget call response.
func ErrorResponse(code, message string, details map[string]interface{}) WidgetCallResponse {
	return WidgetCallResponse{
		Success: false,
		Error: &WidgetError{
			Code:    code,
			Message: message,
			Details: details,
		},
	}
}

// ValidationError creates a validation error response.
func ValidationError(message string, field string) WidgetCallResponse {
	return ErrorResponse("VALIDATION_ERROR", message, map[string]interface{}{
		"field": field,
	})
}

// NotFoundError creates a not found error response.
func NotFoundError(message string) WidgetCallResponse {
	return ErrorResponse("NOT_FOUND", message, nil)
}

// InternalError creates an internal error response.
func InternalError(message string) WidgetCallResponse {
	return ErrorResponse("INTERNAL_ERROR", message, nil)
}

// UnauthorizedError creates an unauthorized error response.
func UnauthorizedError(message string) WidgetCallResponse {
	return ErrorResponse("UNAUTHORIZED", message, nil)
}
