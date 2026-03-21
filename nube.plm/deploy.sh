#!/bin/bash
set -e

# PLM Plugin Deployment Script
# Builds and deploys the PLM plugin to the test org

PLUGIN_NAME="nube.plm"
ORG_ID="${1:-test}"
RUBIX_DIR="${RUBIX_DIR:-/home/user/code/go/nube/rubix}"
PLUGIN_DIR="${RUBIX_DIR}/bin/orgs/${ORG_ID}/plugins/${PLUGIN_NAME}"

echo "🔨 Building PLM plugin..."
cd "$(dirname "$0")"
go build -o bin/${PLUGIN_NAME}

echo "📁 Creating plugin directory: ${PLUGIN_DIR}"
mkdir -p "${PLUGIN_DIR}"

echo "📦 Copying plugin binary..."
# Use rm -f to avoid "Text file busy" error
rm -f "${PLUGIN_DIR}/${PLUGIN_NAME}"
cp bin/${PLUGIN_NAME} "${PLUGIN_DIR}/"
chmod +x "${PLUGIN_DIR}/${PLUGIN_NAME}"

echo "📄 Copying plugin.json..."
cp plugin.json "${PLUGIN_DIR}/"

echo "✅ PLM plugin deployed to: ${PLUGIN_DIR}"
echo ""
echo "Next steps:"
echo "  1. Restart rubix server: cd ${RUBIX_DIR} && ./bin/rubix --port 9000"
echo "  2. Check logs for: 'plugin node ID' and 'PLM hierarchy ready'"
echo "  3. Verify DB: sqlite3 ${RUBIX_DIR}/bin/dev/data/db/rubix.db"
echo ""
echo "Database verification:"
echo "  sqlite3 ${RUBIX_DIR}/bin/dev/data/db/rubix.db \\"
echo "    \"SELECT id, name, type, parent_id FROM nodes WHERE type LIKE 'plm.%' OR id = 'plugin_nube.plm';\""
