module github.com/NubeIO/rubix-plm-plugin

go 1.24.6

require github.com/NubeIO/rubix-plugin v0.0.0

require (
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/nats-io/nats.go v1.47.0 // indirect
	github.com/nats-io/nkeys v0.4.11 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	github.com/rs/zerolog v1.34.0 // indirect
	github.com/xeipuuv/gojsonpointer v0.0.0-20180127040702-4e3ac2762d5f // indirect
	github.com/xeipuuv/gojsonreference v0.0.0-20180127040603-bd5ef7bd5415 // indirect
	github.com/xeipuuv/gojsonschema v1.2.0 // indirect
	golang.org/x/crypto v0.37.0 // indirect
	golang.org/x/sys v0.38.0 // indirect
)

// Use local rubix-plugin library
replace github.com/NubeIO/rubix-plugin => /home/user/code/go/nube/rubix-plugin
