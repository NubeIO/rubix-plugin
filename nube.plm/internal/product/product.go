package product

// Product represents a PLM product node
// This matches the plm.product type defined in plugin.json
type Product struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Type     string            `json:"type"`
	Settings ProductSettings   `json:"settings"`
	Metadata map[string]string `json:"metadata,omitempty"`
}

// ProductSettings holds product-specific settings
// This mirrors the settings schema in plugin.json
type ProductSettings struct {
	ProductCode string  `json:"productCode,omitempty"`
	Description string  `json:"description,omitempty"`
	Status      string  `json:"status,omitempty"`      // Design, Prototype, Production, Discontinued
	Price       float64 `json:"price,omitempty"`
}

// Validate checks if product settings are valid
// Future: Add validation logic here
func (p *Product) Validate() error {
	// Future: Add validation rules
	// - ProductCode format
	// - Status in allowed values
	// - Price >= 0
	return nil
}

// CalculateCost computes product cost
// Future: Will compute from BOM when Phase 2 is implemented
func (p *Product) CalculateCost() float64 {
	// Phase 1: Just return the price
	return p.Settings.Price

	// Phase 2: Calculate from BOM
	// return sum of (part.unitCost * quantity) for all BOM items
}

// Service provides product business logic
type Service struct {
	// Future: Add dependencies here
	// - NATS client for queries
	// - Cache for product lookups
	// - BOM calculator
}

// NewService creates a new product service
func NewService() *Service {
	return &Service{}
}

// Create creates a new product
// Future: Add custom creation logic here
func (s *Service) Create(product *Product) error {
	// Future: Add pre-creation logic
	// - Generate product code if empty
	// - Set default status
	// - Validate settings

	// For now, just validate
	return product.Validate()
}

// Update updates a product
// Future: Add custom update logic here
func (s *Service) Update(product *Product) error {
	// Future: Add pre-update logic
	// - Recalculate BOM if refs changed
	// - Update version history
	// - Notify subscribers

	return product.Validate()
}

// Delete deletes a product
// Future: Add custom delete logic here
func (s *Service) Delete(productID string) error {
	// Future: Add pre-delete checks
	// - Check if product has active orders
	// - Check if used in BOMs
	// - Archive instead of hard delete

	return nil
}

// Query queries products
// Future: Add custom query logic here
func (s *Service) Query(filter string) ([]*Product, error) {
	// Future: Add query helpers
	// - Query by status
	// - Query by price range
	// - Query by product code pattern

	return nil, nil
}
