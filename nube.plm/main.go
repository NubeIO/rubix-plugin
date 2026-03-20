package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nats-io/nats.go"
)

func main() {
	// Get NATS URL from environment or use default
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = "nats://localhost:4222"
	}

	log.Printf("[PLM] Starting PLM plugin")
	log.Printf("[PLM] Connecting to NATS at %s", natsURL)

	// Connect to NATS
	nc, err := nats.Connect(natsURL,
		nats.Name("plm-plugin"),
		nats.Timeout(10*time.Second),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(-1), // unlimited reconnects
	)
	if err != nil {
		log.Fatalf("[PLM] Failed to connect to NATS: %v", err)
	}
	defer nc.Close()

	log.Printf("[PLM] Connected to NATS")

	// Phase 1: Hooks disabled - just product CRUD
	// Phase 2: Will add BOM hooks later

	log.Printf("[PLM] ✓ Plugin ready - Product CRUD only")
	log.Printf("[PLM] ✓ Hooks: DISABLED (Phase 1)")

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Printf("[PLM] Shutting down...")
}

// Hook handlers - DISABLED for Phase 1
// Phase 2: Will add BOM explosion logic here
