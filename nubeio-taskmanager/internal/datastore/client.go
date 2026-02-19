// Package datastore provides a NATS client for the rubix plugindata service.
// The plugin never touches the database directly — all CRUD goes through rubix
// via the structured NATS subjects that rubix's plugindata service subscribes to.
package datastore

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
)

const defaultTimeout = 10 * time.Second

// Client sends structured CRUD requests to rubix's plugindata NATS service.
// rubix enforces org_id isolation on every operation.
type Client struct {
	nc       *natslib.Client
	pluginID string // e.g. "nube.taskmanager"
	prefix   string // e.g. "rubix.v1.local"
	orgID    string
	deviceID string
}

// NewClient creates a datastore Client.
func NewClient(nc *natslib.Client, prefix, orgID, deviceID, pluginID string) *Client {
	return &Client{
		nc:       nc,
		pluginID: pluginID,
		prefix:   prefix,
		orgID:    orgID,
		deviceID: deviceID,
	}
}

// subject builds a plugindata NATS subject for the given operation.
// Format: {prefix}.{orgId}.{deviceId}.plugindata.{vendor}.{name}.{op}
func (c *Client) subject(op string) string {
	// pluginID "nube.taskmanager" → vendor="nube" name="taskmanager"
	vendor, name := splitPluginID(c.pluginID)
	return fmt.Sprintf("%s.%s.%s.plugindata.%s.%s.%s",
		c.prefix, c.orgID, c.deviceID, vendor, name, op)
}

func splitPluginID(id string) (vendor, name string) {
	for i, ch := range id {
		if ch == '.' {
			return id[:i], id[i+1:]
		}
	}
	return id, ""
}

// AggregateColumn describes a single aggregate function to compute.
type AggregateColumn struct {
	Fn    string `json:"fn"`    // "count", "sum", "avg", "min", "max"
	Col   string `json:"col"`   // column name or "*"
	Alias string `json:"alias"` // key in result map
}

// --- Query ---

type queryRequest struct {
	Table   string                 `json:"table"`
	Filter  map[string]interface{} `json:"filter,omitempty"`
	OrderBy string                 `json:"orderBy,omitempty"`
	Limit   int                    `json:"limit,omitempty"`
	Offset  int                    `json:"offset,omitempty"`
}

// Query fetches rows from a plugin-owned table, scoped to the client's org.
func (c *Client) Query(table string, filter map[string]interface{}, orderBy string, limit, offset int) ([]map[string]interface{}, error) {
	req := queryRequest{Table: table, Filter: filter, OrderBy: orderBy, Limit: limit, Offset: offset}
	return c.doRows(c.subject("query"), req)
}

// --- Insert ---

type insertRequest struct {
	Table string                 `json:"table"`
	Data  map[string]interface{} `json:"data"`
}

// Insert adds a row and returns it with the generated id.
func (c *Client) Insert(table string, data map[string]interface{}) (map[string]interface{}, error) {
	req := insertRequest{Table: table, Data: data}
	return c.doRow(c.subject("insert"), req)
}

// --- Update ---

type updateRequest struct {
	Table string                 `json:"table"`
	ID    interface{}            `json:"id"`
	Data  map[string]interface{} `json:"data"`
}

// Update modifies a row by id.
func (c *Client) Update(table string, id interface{}, data map[string]interface{}) error {
	req := updateRequest{Table: table, ID: id, Data: data}
	_, err := c.doRow(c.subject("update"), req)
	return err
}

// --- Delete ---

type deleteRequest struct {
	Table string      `json:"table"`
	ID    interface{} `json:"id"`
}

// Delete removes a row by id.
func (c *Client) Delete(table string, id interface{}) error {
	req := deleteRequest{Table: table, ID: id}
	_, err := c.doRow(c.subject("delete"), req)
	return err
}

// --- Aggregate ---

type aggregateRequest struct {
	Table   string                 `json:"table"`
	Columns []AggregateColumn      `json:"columns"`
	Filter  map[string]interface{} `json:"filter,omitempty"`
	GroupBy []string               `json:"groupBy,omitempty"`
}

// Aggregate runs aggregate functions on a plugin-owned table.
func (c *Client) Aggregate(table string, cols []AggregateColumn, filter map[string]interface{}, groupBy []string) ([]map[string]interface{}, error) {
	req := aggregateRequest{Table: table, Columns: cols, Filter: filter, GroupBy: groupBy}
	return c.doRows(c.subject("aggregate"), req)
}

// --- Response envelope ---

type natsResponse struct {
	Success bool            `json:"success"`
	Error   string          `json:"error,omitempty"`
	Data    json.RawMessage `json:"data,omitempty"`
}

func (c *Client) request(subject string, payload interface{}) (json.RawMessage, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}
	raw, err := c.nc.Request(subject, data, defaultTimeout)
	if err != nil {
		return nil, fmt.Errorf("nats request %s: %w", subject, err)
	}
	var resp natsResponse
	if err := json.Unmarshal(raw, &resp); err != nil {
		return nil, fmt.Errorf("unmarshal response: %w", err)
	}
	if !resp.Success {
		return nil, fmt.Errorf("plugindata error: %s", resp.Error)
	}
	return resp.Data, nil
}

func (c *Client) doRows(subject string, payload interface{}) ([]map[string]interface{}, error) {
	raw, err := c.request(subject, payload)
	if err != nil {
		return nil, err
	}
	var rows []map[string]interface{}
	if err := json.Unmarshal(raw, &rows); err != nil {
		return nil, fmt.Errorf("unmarshal rows: %w", err)
	}
	return rows, nil
}

func (c *Client) doRow(subject string, payload interface{}) (map[string]interface{}, error) {
	raw, err := c.request(subject, payload)
	if err != nil {
		return nil, err
	}
	if len(raw) == 0 || string(raw) == "null" {
		return nil, nil
	}
	var row map[string]interface{}
	if err := json.Unmarshal(raw, &row); err != nil {
		return nil, fmt.Errorf("unmarshal row: %w", err)
	}
	return row, nil
}
