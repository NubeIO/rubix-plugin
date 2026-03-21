package natslib

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// ServerStatus contains rubix core availability info
type ServerStatus struct {
	Ready     bool
	Ping      bool
	Message   string
	CheckedAt time.Time
}

// CheckServerReady pings rubix core to see if it's responding
// Sends a simple query request and checks for response
// Subject should be built as: client.Subject.Build("query", "create")
func (c *Client) CheckServerReady(ctx context.Context, subject string) (*ServerStatus, error) {
	status := &ServerStatus{
		Ready:     false,
		Ping:      false,
		CheckedAt: time.Now(),
	}

	// Extract org and device IDs from subject for envelope
	// Subject format: rubix.v1.{scope}.{orgId}.{deviceId}.*.query.create
	parts := strings.Split(subject, ".")
	if len(parts) < 6 {
		status.Message = "invalid subject format"
		return status, fmt.Errorf("invalid subject format: %s", subject)
	}
	orgID := parts[3]
	deviceID := parts[4]

	// Wrap in NATS envelope (required by gateway's NATS subscriber)
	envelope := map[string]interface{}{
		"method": "POST",
		"path":   fmt.Sprintf("/api/v1/orgs/%s/devices/%s/query", orgID, deviceID),
		"params": map[string]string{
			"orgId":    orgID,
			"deviceId": deviceID,
		},
		"body": map[string]interface{}{
			"filter": "type is \"auth.org\"", // Simple ping - check for org node
			"limit":  1,
		},
	}

	reqData, err := json.Marshal(envelope)
	if err != nil {
		status.Message = "failed to marshal ping request"
		return status, err
	}

	// Short timeout for health check
	respData, err := c.Request(subject, reqData, 2*time.Second)
	if err != nil {
		status.Message = fmt.Sprintf("no response: %v", err)
		return status, err
	}

	// NATS response wraps HTTP response
	var natsResponse struct {
		Data struct {
			Data []interface{}          `json:"data"`
			Meta map[string]interface{} `json:"meta"`
		} `json:"data"`
		Status int `json:"status"`
	}
	if err := json.Unmarshal(respData, &natsResponse); err != nil {
		status.Ping = true
		status.Message = "got response but invalid format"
		return status, err
	}

	status.Ready = true
	status.Ping = true
	status.Message = "server is ready"
	return status, nil
}

// WaitForServerOpts configures server wait behavior
type WaitForServerOpts struct {
	Subject  string                                          // NATS subject to ping (e.g., "rubix.v1.local.org1.dev1.main.query")
	MaxWait  time.Duration                                   // Maximum time to wait (0 = wait forever)
	OnRetry  func(attempt int, nextDelay time.Duration)     // Callback on each retry
	OnStatus func(attempt int, status *ServerStatus) error  // Callback to check status (return error to abort)
}

// WaitForServer waits for rubix core to be ready with exponential backoff
// This is reusable for ANY NATS-based waiting scenario
func (c *Client) WaitForServer(ctx context.Context, opts WaitForServerOpts) error {
	attempt := 0
	startTime := time.Now()

	// Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
	delays := []time.Duration{
		1 * time.Second,
		2 * time.Second,
		4 * time.Second,
		8 * time.Second,
		16 * time.Second,
		30 * time.Second,
	}

	for {
		attempt++

		// Check if server is ready
		status, err := c.CheckServerReady(ctx, opts.Subject)

		// Call status callback if provided (allows custom checks)
		if opts.OnStatus != nil {
			if statusErr := opts.OnStatus(attempt, status); statusErr != nil {
				return fmt.Errorf("status check failed: %w", statusErr)
			}
		}

		if err == nil && status.Ready {
			return nil // Server is ready!
		}

		// Check if we've exceeded max wait time
		if opts.MaxWait > 0 && time.Since(startTime) > opts.MaxWait {
			return fmt.Errorf("timeout waiting for server after %v (last status: %s)", opts.MaxWait, status.Message)
		}

		// Calculate delay for next attempt (exponential backoff with max)
		delayIndex := attempt - 1
		if delayIndex >= len(delays) {
			delayIndex = len(delays) - 1
		}
		nextDelay := delays[delayIndex]

		// Call retry callback if provided
		if opts.OnRetry != nil {
			opts.OnRetry(attempt, nextDelay)
		}

		// Wait before retry
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(nextDelay):
			// Continue to next attempt
		}
	}
}

// RetryOperation retries a function with exponential backoff
// Generic retry pattern for any NATS operation
func (c *Client) RetryOperation(ctx context.Context, maxWait time.Duration, onRetry func(attempt int, nextDelay time.Duration), operation func() error) error {
	attempt := 0
	startTime := time.Now()

	delays := []time.Duration{
		1 * time.Second,
		2 * time.Second,
		4 * time.Second,
		8 * time.Second,
		16 * time.Second,
		30 * time.Second,
	}

	for {
		attempt++

		// Try the operation
		err := operation()
		if err == nil {
			return nil // Success!
		}

		// Check if we've exceeded max wait time
		if maxWait > 0 && time.Since(startTime) > maxWait {
			return fmt.Errorf("timeout after %v: %w", maxWait, err)
		}

		// Calculate delay for next attempt
		delayIndex := attempt - 1
		if delayIndex >= len(delays) {
			delayIndex = len(delays) - 1
		}
		nextDelay := delays[delayIndex]

		// Call retry callback if provided
		if onRetry != nil {
			onRetry(attempt, nextDelay)
		}

		// Wait before retry
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(nextDelay):
			// Continue to next attempt
		}
	}
}
