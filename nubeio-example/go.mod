module github.com/NubeIO/nubeio-example

go 1.24.6

require (
	github.com/NubeIO/rubix-plugin v0.0.0
	github.com/rs/zerolog v1.34.0
)

require (
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/nats-io/nats.go v1.47.0 // indirect
	github.com/nats-io/nkeys v0.4.11 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	golang.org/x/crypto v0.37.0 // indirect
	golang.org/x/sys v0.32.0 // indirect
)

// Local development — replace with a tagged version when published
replace github.com/NubeIO/rubix-plugin => /home/user/code/go/nube/rubix-plugin
