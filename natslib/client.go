package natslib

import "github.com/nats-io/nats.go"

// Client is a thin wrapper around a NATS connection.
type Client struct {
	conn *nats.Conn
}

// Connect establishes a NATS connection.
func Connect(url string) (*Client, error) {
	nc, err := nats.Connect(url)
	if err != nil {
		return nil, err
	}
	return &Client{conn: nc}, nil
}

// SubscribeMsg subscribes to a subject with a raw message handler.
func (c *Client) SubscribeMsg(subject string, handler nats.MsgHandler) (*nats.Subscription, error) {
	return c.conn.Subscribe(subject, handler)
}

// Publish sends data to a subject.
func (c *Client) Publish(subject string, data []byte) error {
	return c.conn.Publish(subject, data)
}

// Close closes the NATS connection.
func (c *Client) Close() {
	c.conn.Close()
}
