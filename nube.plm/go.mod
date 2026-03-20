module github.com/NubeIO/rubix-plm-plugin

go 1.24.6

require (
	github.com/NubeDev/rubix-plugin v0.0.0
	github.com/nats-io/nats.go v1.47.0
)

require (
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/nats-io/nkeys v0.4.11 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	golang.org/x/crypto v0.37.0 // indirect
	golang.org/x/sys v0.38.0 // indirect
)

// Use local rubix-plugin library
replace github.com/NubeDev/rubix-plugin => /home/user/code/go/nube/rubix-plugin
