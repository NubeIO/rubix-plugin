package nodehooks

import (
	"context"
	"encoding/json"

	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog/log"
)

// NATSHandler wraps NodeHooks and provides NATS subscription handlers
// This makes it easy for plugins to expose hook endpoints via NATS
type NATSHandler struct {
	hooks   NodeHooks
	client  *natslib.Client
	subject *SubjectBuilder
	subs    []*nats.Subscription
}

// NewNATSHandler creates a new NATS handler for node hooks
func NewNATSHandler(hooks NodeHooks, client *natslib.Client, subject *SubjectBuilder) *NATSHandler {
	return &NATSHandler{
		hooks:   hooks,
		client:  client,
		subject: subject,
		subs:    make([]*nats.Subscription, 0),
	}
}

// RegisterAll subscribes to all hook subjects
// This should be called after the plugin connects to NATS
func (h *NATSHandler) RegisterAll() error {
	// Subscribe to before-create
	sub, err := h.client.SubscribeMsg(h.subject.BeforeCreate(), h.handleBeforeCreate)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.BeforeCreate()).Msg("Subscribed to beforeCreate hook")

	// Subscribe to after-create
	sub, err = h.client.SubscribeMsg(h.subject.AfterCreate(), h.handleAfterCreate)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.AfterCreate()).Msg("Subscribed to afterCreate hook")

	// Subscribe to before-update
	sub, err = h.client.SubscribeMsg(h.subject.BeforeUpdate(), h.handleBeforeUpdate)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.BeforeUpdate()).Msg("Subscribed to beforeUpdate hook")

	// Subscribe to after-update
	sub, err = h.client.SubscribeMsg(h.subject.AfterUpdate(), h.handleAfterUpdate)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.AfterUpdate()).Msg("Subscribed to afterUpdate hook")

	// Subscribe to before-delete
	sub, err = h.client.SubscribeMsg(h.subject.BeforeDelete(), h.handleBeforeDelete)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.BeforeDelete()).Msg("Subscribed to beforeDelete hook")

	// Subscribe to after-delete
	sub, err = h.client.SubscribeMsg(h.subject.AfterDelete(), h.handleAfterDelete)
	if err != nil {
		return err
	}
	h.subs = append(h.subs, sub)
	log.Info().Str("subject", h.subject.AfterDelete()).Msg("Subscribed to afterDelete hook")

	log.Info().Int("subscriptions", len(h.subs)).Msg("Node hooks registered via NATS")
	return nil
}

// Unsubscribe unsubscribes from all hook subjects
func (h *NATSHandler) Unsubscribe() {
	for _, sub := range h.subs {
		sub.Unsubscribe()
	}
	h.subs = nil
	log.Info().Msg("Node hooks unsubscribed")
}

// ============================================================================
// NATS Message Handlers
// ============================================================================

func (h *NATSHandler) handleBeforeCreate(msg *nats.Msg) {
	var req BeforeCreateRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal beforeCreate request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.BeforeCreate(context.Background(), &req)
	if err != nil {
		log.Error().Err(err).Str("nodeType", req.Node.Type).Msg("beforeCreate hook failed")
		h.respondError(msg, err)
		return
	}

	h.respondJSON(msg, resp)
}

func (h *NATSHandler) handleAfterCreate(msg *nats.Msg) {
	var req AfterCreateRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal afterCreate request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.AfterCreate(context.Background(), &req)
	if err != nil {
		// After hooks are best-effort - log but don't fail
		log.Warn().Err(err).Str("nodeId", req.Node.ID).Msg("afterCreate hook failed")
	}

	h.respondJSON(msg, resp)
}

func (h *NATSHandler) handleBeforeUpdate(msg *nats.Msg) {
	var req BeforeUpdateRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal beforeUpdate request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.BeforeUpdate(context.Background(), &req)
	if err != nil {
		log.Error().Err(err).Str("nodeType", req.NewNode.Type).Msg("beforeUpdate hook failed")
		h.respondError(msg, err)
		return
	}

	h.respondJSON(msg, resp)
}

func (h *NATSHandler) handleAfterUpdate(msg *nats.Msg) {
	var req AfterUpdateRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal afterUpdate request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.AfterUpdate(context.Background(), &req)
	if err != nil {
		log.Warn().Err(err).Str("nodeId", req.NewNode.ID).Msg("afterUpdate hook failed")
	}

	h.respondJSON(msg, resp)
}

func (h *NATSHandler) handleBeforeDelete(msg *nats.Msg) {
	var req BeforeDeleteRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal beforeDelete request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.BeforeDelete(context.Background(), &req)
	if err != nil {
		log.Error().Err(err).Str("nodeType", req.Node.Type).Msg("beforeDelete hook failed")
		h.respondError(msg, err)
		return
	}

	h.respondJSON(msg, resp)
}

func (h *NATSHandler) handleAfterDelete(msg *nats.Msg) {
	var req AfterDeleteRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal afterDelete request")
		h.respondError(msg, err)
		return
	}

	resp, err := h.hooks.AfterDelete(context.Background(), &req)
	if err != nil {
		log.Warn().Err(err).Str("nodeId", req.Node.ID).Msg("afterDelete hook failed")
	}

	h.respondJSON(msg, resp)
}

// ============================================================================
// Response Helpers
// ============================================================================

func (h *NATSHandler) respondJSON(msg *nats.Msg, data interface{}) {
	respData, err := json.Marshal(data)
	if err != nil {
		log.Error().Err(err).Msg("Failed to marshal response")
		h.respondError(msg, err)
		return
	}

	if err := msg.Respond(respData); err != nil {
		log.Error().Err(err).Msg("Failed to send response")
	}
}

func (h *NATSHandler) respondError(msg *nats.Msg, err error) {
	errResp := map[string]string{"error": err.Error()}
	respData, _ := json.Marshal(errResp)
	msg.Respond(respData)
}
