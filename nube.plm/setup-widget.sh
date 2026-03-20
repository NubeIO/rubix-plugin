#!/bin/bash
# Quick setup script for PLM plugin widget

set -e

echo "🏭 PLM Plugin - Widget Setup"
echo "============================="
echo ""

# Step 1: Install frontend dependencies
echo "📦 Step 1: Installing frontend dependencies..."
cd frontend
pnpm install
echo "✓ Dependencies installed"
echo ""

# Step 2: Build widget
echo "🔨 Step 2: Building widget..."
pnpm build
echo "✓ Widget built → dist-frontend/remoteEntry.js"
echo ""

# Step 3: Verify build
if [ -f "../dist-frontend/remoteEntry.js" ]; then
  echo "✓ Widget build successful!"
  ls -lh ../dist-frontend/remoteEntry.js
else
  echo "❌ Widget build failed - remoteEntry.js not found"
  exit 1
fi
echo ""

# Step 4: Copy to Rubix (if Rubix directory exists)
RUBIX_DIR="/home/user/code/go/nube/rubix"
PLUGIN_DIR="$RUBIX_DIR/bin/orgs/default/plugins/nube.plm"

if [ -d "$RUBIX_DIR" ]; then
  echo "📋 Step 3: Copying to Rubix..."
  mkdir -p "$PLUGIN_DIR"

  # Copy backend binary
  cp ../nube.plm "$PLUGIN_DIR/"
  echo "  ✓ Backend binary copied"

  # Copy plugin.json
  cp ../plugin.json "$PLUGIN_DIR/"
  echo "  ✓ plugin.json copied"

  # Copy frontend
  cp -r ../dist-frontend "$PLUGIN_DIR/"
  echo "  ✓ Frontend widget copied"

  # Copy settings YAML
  cp ../product-table-widget-settings.yaml "$PLUGIN_DIR/"
  echo "  ✓ Settings schema copied"

  echo ""
  echo "✅ Plugin installed to: $PLUGIN_DIR"
  echo ""
  echo "📝 Next steps:"
  echo "   1. Start Rubix: cd $RUBIX_DIR && go run cmd/server/main.go"
  echo "   2. Open scene builder"
  echo "   3. Go to Components panel → Plugins section"
  echo "   4. Drag 'Product Table' widget onto canvas"
  echo ""
else
  echo "⚠️  Rubix directory not found at $RUBIX_DIR"
  echo ""
  echo "📝 Manual installation:"
  echo "   1. Create directory: mkdir -p <rubix>/bin/orgs/default/plugins/nube.plm/"
  echo "   2. Copy files:"
  echo "      - nube.plm (binary)"
  echo "      - plugin.json"
  echo "      - dist-frontend/ (directory)"
  echo "      - product-table-widget-settings.yaml"
  echo "   3. Restart Rubix"
  echo ""
fi

echo "🎉 Widget setup complete!"
