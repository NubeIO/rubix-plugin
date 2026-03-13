.PHONY: demo-gen demo-build

demo-gen:
	go run ./cmd/fake-plugin-generator

demo-build:
	go build ./cmd/fake-plugin-generator