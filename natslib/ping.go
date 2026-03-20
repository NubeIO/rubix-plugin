package natslib

import "context"

// Ping sends a simple request and checks for response
// Returns nil if server responds, error otherwise
func (c *Client) Ping(ctx context.Context, subject string) error {
	status, err := c.CheckServerReady(ctx, subject)
	if err != nil {
		return err
	}
	if !status.Ready {
		return ErrServerNotReady
	}
	return nil
}

// ErrServerNotReady indicates rubix core is not responding
var ErrServerNotReady = &ServerError{Message: "rubix core not ready"}

// ServerError represents a server availability error
type ServerError struct {
	Message string
}

func (e *ServerError) Error() string {
	return e.Message
}
