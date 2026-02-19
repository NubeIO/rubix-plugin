.PHONY: build run tidy

build:
	go build -o taskmanager ./cmd/

tidy:
	go mod tidy

run:
	go run ./cmd/ \
		--nats nats://localhost:4222 \
		--org org1 \
		--device device0 \
		--prefix rubix.v1.local \
		--vendor nube \
		--name taskmanager \
		--log debug
