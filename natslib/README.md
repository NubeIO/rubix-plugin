# NATS Library - Health Checks & Retry

Thin wrapper around NATS with health checks and retry logic.

## Features

- ✅ **Health checks** - Ping rubix core to check if ready
- ✅ **Retry with backoff** - Exponential backoff (1s → 2s → 4s → 8s → 16s → 30s)
- ✅ **Generic retry** - Retry any NATS operation
- ✅ **Reusable** - Works for any NATS-based communication

## Usage

### Basic Connection

```go
import "github.com/NubeIO/rubix-plugin/natslib"

nc, err := natslib.Connect("nats://localhost:4222")
if err != nil {
    log.Fatal(err)
}
defer nc.Close()
```

### Health Check

```go
// Ping rubix core
subject := "rubix.v1.local.org1.dev1.main.query"
status, err := nc.CheckServerReady(ctx, subject)

if status.Ready {
    fmt.Println("✅ Server is ready!")
} else {
    fmt.Printf("❌ Server not ready: %s\n", status.Message)
}
```

### Wait for Server (with retry)

```go
// Wait up to 5 minutes for rubix core
subject := "rubix.v1.local.org1.dev1.main.query"

err := nc.WaitForServer(ctx, natslib.WaitForServerOpts{
    Subject: subject,
    MaxWait: 5 * time.Minute,
    OnRetry: func(attempt int, nextDelay time.Duration) {
        log.Printf("Attempt %d: waiting %v for rubix core...", attempt, nextDelay)
    },
})

if err != nil {
    log.Fatal("Rubix core did not start:", err)
}

fmt.Println("✅ Rubix core is ready!")
```

### Generic Retry Pattern

```go
// Retry any operation with exponential backoff
err := nc.RetryOperation(ctx, 5*time.Minute,
    func(attempt int, nextDelay time.Duration) {
        log.Printf("Retry %d in %v...", attempt, nextDelay)
    },
    func() error {
        // Your operation here
        return someNATSOperation()
    },
)
```

### Custom Status Check

```go
// Wait with custom status validation
err := nc.WaitForServer(ctx, natslib.WaitForServerOpts{
    Subject: subject,
    MaxWait: 5 * time.Minute,
    OnStatus: func(attempt int, status *natslib.ServerStatus) error {
        // Custom logic - abort if specific condition
        if attempt > 10 && !status.Ping {
            return fmt.Errorf("no ping after 10 attempts - aborting")
        }
        return nil
    },
})
```

## Retry Backoff Schedule

```
Attempt 1 → wait 1 second
Attempt 2 → wait 2 seconds
Attempt 3 → wait 4 seconds
Attempt 4 → wait 8 seconds
Attempt 5 → wait 16 seconds
Attempt 6+ → wait 30 seconds (max)
```

## Error Handling

```go
status, err := nc.CheckServerReady(ctx, subject)

switch {
case err != nil:
    // NATS error (connection issue, timeout, etc.)
    log.Printf("NATS error: %v", err)

case !status.Ready:
    // Server responded but not ready
    log.Printf("Server not ready: %s", status.Message)

case status.Ready:
    // Server is ready - proceed
    log.Println("✅ Ready to go!")
}
```

## Integration with Bootstrap

The bootstrap library uses natslib health checks:

```go
// Bootstrap automatically waits for rubix core
result, err := bootstrap.EnsureHierarchyWithRetry(ctx, client, spec, maxWait, onRetry)
```

## Use Cases

### Plugin Startup
```go
// Wait for rubix core before initializing
nc.WaitForServer(ctx, opts)
// Now safe to create nodes, subscribe to subjects, etc.
```

### Connection Recovery
```go
// Retry after disconnect
nc.RetryOperation(ctx, maxWait, onRetry, func() error {
    return nc.Publish(subject, data)
})
```

### Pre-flight Checks
```go
// Check before expensive operation
if err := nc.Ping(ctx, subject); err != nil {
    return fmt.Errorf("rubix core not ready: %w", err)
}
// Proceed with operation
```

## API Reference

### CheckServerReady

```go
func (c *Client) CheckServerReady(ctx context.Context, subject string) (*ServerStatus, error)
```

Pings rubix core and returns status.

### WaitForServer

```go
func (c *Client) WaitForServer(ctx context.Context, opts WaitForServerOpts) error
```

Waits for server with retry and backoff.

### RetryOperation

```go
func (c *Client) RetryOperation(ctx context.Context, maxWait time.Duration, onRetry func(attempt int, nextDelay time.Duration), operation func() error) error
```

Generic retry wrapper for any operation.

### Ping

```go
func (c *Client) Ping(ctx context.Context, subject string) error
```

Simple ping (returns error if not ready).

## Types

### ServerStatus

```go
type ServerStatus struct {
    Ready     bool      // Server is ready to handle requests
    Ping      bool      // Got a response (even if invalid)
    Message   string    // Status message
    CheckedAt time.Time // When check was performed
}
```

### WaitForServerOpts

```go
type WaitForServerOpts struct {
    Subject  string                                      // NATS subject to ping
    MaxWait  time.Duration                               // Max time to wait (0 = forever)
    OnRetry  func(attempt int, nextDelay time.Duration) // Called on each retry
    OnStatus func(attempt int, status *ServerStatus) error // Custom status check
}
```
