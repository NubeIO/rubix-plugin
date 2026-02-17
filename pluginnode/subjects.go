package pluginnode

import "fmt"

// SubjectBuilder creates NATS subjects for plugin communication.
//
// Subject scheme:
//
//	Health:         {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.health
//	Plugin control: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.control
//	Node RPC:       {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.{nodeId}.rpc
//	Node emit:      {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.{nodeId}.emit.{port}
//
// App-only plugins (nodeTypes:[]) only need Health + PluginControl.
// Node plugins must also handle RPCWildcard (subscribe) and send via Emit.
type SubjectBuilder struct {
	prefix     string
	orgID      string
	deviceID   string
	vendor     string
	pluginName string
}

func NewSubjectBuilder(prefix, orgID, deviceID, vendor, pluginName string) *SubjectBuilder {
	return &SubjectBuilder{prefix, orgID, deviceID, vendor, pluginName}
}

// Health returns the subject rubix uses to check if this plugin is alive.
// Plugin must subscribe and respond with a pingResponse payload.
func (sb *SubjectBuilder) Health() string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.health",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName)
}

// PluginControl returns the subject for plugin-level lifecycle commands
// (start, stop, restart, ping, getStatus sent by rubix PluginManager).
func (sb *SubjectBuilder) PluginControl() string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.control",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName)
}

// RPCWildcard returns a subscription pattern that matches every node RPC call
// sent to this plugin. Subscribe to this to receive init/process/close calls
// for all node instances.
//
// Pattern: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.*.rpc
func (sb *SubjectBuilder) RPCWildcard() string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.*.rpc",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName)
}

// RPC returns the subject for RPC calls directed at one specific node instance.
// Rubix sends init/process/close requests here; the plugin must respond inline.
//
// Subject: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.{nodeId}.rpc
func (sb *SubjectBuilder) RPC(nodeID string) string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.%s.rpc",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName, nodeID)
}

// Emit returns the subject a plugin uses to push an autonomous value from a
// specific output port of a node (e.g. a polling timer firing on its own).
// Rubix subscribes via EmitAll and dispatches the value downstream.
//
// Subject: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.{nodeId}.emit.{portHandle}
func (sb *SubjectBuilder) Emit(nodeID, portHandle string) string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.%s.emit.%s",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName, nodeID, portHandle)
}

// EmitAll returns the subscription wildcard rubix uses to catch every emission
// from a particular node instance.
//
// Pattern: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.{nodeId}.emit.*
func (sb *SubjectBuilder) EmitAll(nodeID string) string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.%s.emit.*",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName, nodeID)
}

// NodeControlWildcard returns a subscription pattern for all node-level control
// commands sent to this plugin (start/stop per node).
//
// Pattern: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.*.control
func (sb *SubjectBuilder) NodeControlWildcard() string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.*.control",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName)
}

// Wildcard is an alias for RPCWildcard kept for backwards compatibility.
//
// Deprecated: use RPCWildcard.
func (sb *SubjectBuilder) Wildcard() string {
	return sb.RPCWildcard()
}
