package bom

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/NubeDev/rubix-plugin/natslib"
	"github.com/NubeDev/rubix-plugin/natssubject"
)

// BOMItem represents a single item in an exploded BOM
type BOMItem struct {
	Level      int                    `json:"level"`      // Hierarchy depth (1, 2, 3...)
	NodeID     string                 `json:"nodeId"`     // Part/assembly ID
	NodeType   string                 `json:"nodeType"`   // plm.part or plm.product
	PartNumber string                 `json:"partNumber"` // From settings
	Name       string                 `json:"name"`
	Quantity   float64                `json:"quantity"`   // Cumulative quantity
	Unit       string                 `json:"unit"`       // pcs, kg, m, etc.
	UnitCost   float64                `json:"unitCost"`   // From part settings
	TotalCost  float64                `json:"totalCost"`  // quantity * unitCost
	LeadTime   int                    `json:"leadTime"`   // From part settings (days)
}

// BOMRollup contains aggregate BOM metrics
type BOMRollup struct {
	TotalCost   float64 `json:"totalCost"`   // Sum of all item costs
	MaxLeadTime int     `json:"maxLeadTime"` // Longest lead time in BOM
	ItemCount   int     `json:"itemCount"`   // Total BOM items
}

// Node represents a node from Rubix
type Node struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"`
	Name     string                 `json:"name"`
	Settings map[string]interface{} `json:"settings"`
}

// Ref represents a reference between nodes
type Ref struct {
	ID          string                 `json:"id"`
	FromNodeID  string                 `json:"fromNodeId"`
	RefName     string                 `json:"refName"`
	ToNodeID    string                 `json:"toNodeId"`
	DisplayName string                 `json:"displayName"`
	Metadata    map[string]interface{} `json:"metadata"`
}

// ExplodeBOM recursively explodes a product's BOM
func ExplodeBOM(nc *natslib.Client, sb *natssubject.Builder, productID string) ([]BOMItem, error) {
	items := []BOMItem{}
	visited := make(map[string]bool) // Cycle detection

	err := explodeRecursive(nc, sb, productID, 1, 1.0, visited, &items)
	if err != nil {
		return nil, err
	}

	return items, nil
}

// explodeRecursive recursively explodes a product/assembly BOM
func explodeRecursive(nc *natslib.Client, sb *natssubject.Builder, nodeID string, level int, qty float64, visited map[string]bool, items *[]BOMItem) error {
	// Cycle detection
	if visited[nodeID] {
		return fmt.Errorf("cycle detected at node %s", nodeID)
	}
	visited[nodeID] = true
	defer func() { visited[nodeID] = false }()

	// Get node via NATS request
	subject := sb.Build("nodes", "get")
	reqData, _ := json.Marshal(map[string]interface{}{"nodeId": nodeID})
	respData, err := nc.Request(subject, reqData, 5*time.Second)
	if err != nil {
		return fmt.Errorf("get node %s: %w", nodeID, err)
	}

	var node Node
	if err := json.Unmarshal(respData, &node); err != nil {
		return fmt.Errorf("unmarshal node: %w", err)
	}

	// Get all refs from this node via query
	querySubject := sb.Build("query")
	query := fmt.Sprintf("fromNodeId is '%s'", nodeID)
	queryReq, _ := json.Marshal(map[string]interface{}{"query": query, "table": "refs"})
	queryResp, err := nc.Request(querySubject, queryReq, 5*time.Second)
	if err != nil {
		return fmt.Errorf("get refs for %s: %w", nodeID, err)
	}

	var refsResult struct {
		Data []*Ref `json:"data"`
	}
	if err := json.Unmarshal(queryResp, &refsResult); err != nil {
		return fmt.Errorf("unmarshal refs: %w", err)
	}
	refs := refsResult.Data

	// Process each bomItem ref
	for _, ref := range refs {
		if ref.RefName != "bomItem" {
			continue // Skip non-BOM refs
		}

		// Get quantity from ref metadata
		childQty := 1.0
		if qtyVal, ok := ref.Metadata["quantity"]; ok {
			if qtyFloat, ok := qtyVal.(float64); ok {
				childQty = qtyFloat
			}
		}
		totalQty := qty * childQty

		// Get unit from ref metadata
		unit := "pcs"
		if unitVal, ok := ref.Metadata["unit"]; ok {
			if unitStr, ok := unitVal.(string); ok {
				unit = unitStr
			}
		}

		// Get child node via NATS
		childSubject := sb.Build("nodes", "get")
		childReqData, _ := json.Marshal(map[string]interface{}{"nodeId": ref.ToNodeID})
		childRespData, err := nc.Request(childSubject, childReqData, 5*time.Second)
		if err != nil {
			// Log error but continue with other items
			fmt.Printf("[BOM] WARNING: Failed to get child node %s: %v\n", ref.ToNodeID, err)
			continue
		}

		var childNode Node
		if err := json.Unmarshal(childRespData, &childNode); err != nil {
			fmt.Printf("[BOM] WARNING: Failed to unmarshal child node %s: %v\n", ref.ToNodeID, err)
			continue
		}

		// Create BOM item
		item := BOMItem{
			Level:    level,
			NodeID:   childNode.ID,
			NodeType: childNode.Type,
			Name:     childNode.Name,
			Quantity: totalQty,
			Unit:     unit,
		}

		// Add part-specific data
		if childNode.Type == "plm.part" {
			// Get partNumber from settings
			if pn, ok := childNode.Settings["partNumber"].(string); ok {
				item.PartNumber = pn
			}

			// Get unitCost from settings
			if uc, ok := childNode.Settings["unitCost"].(float64); ok {
				item.UnitCost = uc
				item.TotalCost = totalQty * uc
			}

			// Get leadTime from settings
			if lt, ok := childNode.Settings["leadTimeDays"].(float64); ok {
				item.LeadTime = int(lt)
			}
		}

		*items = append(*items, item)

		// Recurse if this is a sub-assembly (another product)
		if childNode.Type == "plm.product" {
			err = explodeRecursive(nc, sb, childNode.ID, level+1, totalQty, visited, items)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// ComputeRollups computes aggregate metrics from BOM items
func ComputeRollups(items []BOMItem) BOMRollup {
	rollup := BOMRollup{
		ItemCount: len(items),
	}

	for _, item := range items {
		rollup.TotalCost += item.TotalCost
		if item.LeadTime > rollup.MaxLeadTime {
			rollup.MaxLeadTime = item.LeadTime
		}
	}

	return rollup
}
