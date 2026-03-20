package nodehooks

import "fmt"

// SubjectBuilder creates NATS subjects for node hook communication
//
// Subject scheme:
//   {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.hooks.{operation}
//
// Examples:
//   rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-create
//   rubix.v1.local.test.device0.plugin.nube.plm.hooks.after-create
//   rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-update
type SubjectBuilder struct {
	prefix     string
	orgID      string
	deviceID   string
	vendor     string
	pluginName string
}

// NewSubjectBuilder creates a new NATS subject builder for node hooks
func NewSubjectBuilder(prefix, orgID, deviceID, vendor, pluginName string) *SubjectBuilder {
	return &SubjectBuilder{
		prefix:     prefix,
		orgID:      orgID,
		deviceID:   deviceID,
		vendor:     vendor,
		pluginName: pluginName,
	}
}

// base returns the base subject for all hook operations
// Pattern: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.hooks
func (sb *SubjectBuilder) base() string {
	return fmt.Sprintf("%s.%s.%s.plugin.%s.%s.hooks",
		sb.prefix, sb.orgID, sb.deviceID, sb.vendor, sb.pluginName)
}

// HooksWildcard returns a subscription pattern for all hook operations
// Pattern: {prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.hooks.*
func (sb *SubjectBuilder) HooksWildcard() string {
	return sb.base() + ".*"
}

// BeforeCreate returns the subject for beforeCreate hook
func (sb *SubjectBuilder) BeforeCreate() string {
	return sb.base() + ".before-create"
}

// AfterCreate returns the subject for afterCreate hook
func (sb *SubjectBuilder) AfterCreate() string {
	return sb.base() + ".after-create"
}

// BeforeUpdate returns the subject for beforeUpdate hook
func (sb *SubjectBuilder) BeforeUpdate() string {
	return sb.base() + ".before-update"
}

// AfterUpdate returns the subject for afterUpdate hook
func (sb *SubjectBuilder) AfterUpdate() string {
	return sb.base() + ".after-update"
}

// BeforeDelete returns the subject for beforeDelete hook
func (sb *SubjectBuilder) BeforeDelete() string {
	return sb.base() + ".before-delete"
}

// AfterDelete returns the subject for afterDelete hook
func (sb *SubjectBuilder) AfterDelete() string {
	return sb.base() + ".after-delete"
}
