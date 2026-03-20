.PHONY: build clean run

build:
	@echo "Building PLM plugin..."
	go build -o nube.plm .
	@echo "✓ Build complete: nube.plm"

clean:
	@echo "Cleaning build artifacts..."
	rm -f nube.plm
	@echo "✓ Clean complete"

run: build
	@echo "Running PLM plugin..."
	./nube.plm
