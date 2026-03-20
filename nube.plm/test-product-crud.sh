#!/bin/bash
# Simple CRUD test for PRODUCT only
# Prerequisites: Rubix running with PLM plugin loaded

set -e

API_BASE="http://localhost:1660/api/v1"
ORG_ID="default"
FLOW_ID="default"

echo "🧪 PLM Plugin - PRODUCT CRUD Test"
echo "=================================="
echo ""

# 1. Create a product
echo "1️⃣  Creating product..."
PRODUCT=$(curl -s -X POST "$API_BASE/$ORG_ID/$FLOW_ID/nodes" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "plm.product",
    "name": "Widget Pro",
    "settings": {
      "productCode": "WP-001",
      "description": "Premium widget with advanced features",
      "status": "Design",
      "price": 250.00
    }
  }')

PRODUCT_ID=$(echo $PRODUCT | jq -r '.id')
echo "   ✓ Product created: $PRODUCT_ID"
echo "   Name: $(echo $PRODUCT | jq -r '.name')"
echo "   Code: $(echo $PRODUCT | jq -r '.settings.productCode')"
echo "   Status: $(echo $PRODUCT | jq -r '.settings.status')"
echo ""

# 2. Read product back
echo "2️⃣  Reading product..."
PRODUCT_READ=$(curl -s "$API_BASE/$ORG_ID/$FLOW_ID/nodes/$PRODUCT_ID")
echo "   ✓ Product read: $(echo $PRODUCT_READ | jq -r '.name')"
echo "   Description: $(echo $PRODUCT_READ | jq -r '.settings.description')"
echo ""

# 3. Update product settings
echo "3️⃣  Updating product status..."
PRODUCT_UPDATE=$(curl -s -X PATCH "$API_BASE/$ORG_ID/$FLOW_ID/nodes/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "status": "Prototype",
      "price": 275.00
    }
  }')

echo "   ✓ Product updated"
echo "   New status: $(echo $PRODUCT_UPDATE | jq -r '.settings.status')"
echo "   New price: \$$(echo $PRODUCT_UPDATE | jq -r '.settings.price')"
echo ""

# 4. Query all products
echo "4️⃣  Querying all products..."
PRODUCTS=$(curl -s -X POST "$API_BASE/$ORG_ID/$FLOW_ID/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "type is \"plm.product\""
  }')

PRODUCT_COUNT=$(echo $PRODUCTS | jq '.data | length')
echo "   ✓ Found $PRODUCT_COUNT product(s)"
echo ""

# 5. Delete product (cleanup)
echo "5️⃣  Cleanup (delete product)..."
curl -s -X DELETE "$API_BASE/$ORG_ID/$FLOW_ID/nodes/$PRODUCT_ID" > /dev/null
echo "   ✓ Deleted product: $PRODUCT_ID"
echo ""

echo "✅ PRODUCT CRUD test complete!"
