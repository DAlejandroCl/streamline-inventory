/* ============================================================
   PRODUCT FACTORY
   Genera datos de test consistentes, válidos por defecto,
   con soporte para overrides y variantes de edge cases.

   Uso:
     productPayload()                  → producto válido
     productPayload({ price: -1 })     → para test de validación
     invalidProductPayloads()          → todas las variantes inválidas
   ============================================================ */

export type ProductPayload = {
  name: string;
  price: number;
  stock: number;
  sku?: string;
  description?: string;
  category_id?: number | null;
  cost?: number;
  availability?: boolean;
};

let counter = 0;

function nextId(): number {
  return ++counter;
}

export const productPayload = (overrides: Partial<ProductPayload> = {}): ProductPayload => ({
  name:  `Test Product ${nextId()}`,
  price: 99.99,
  stock: 10,
  ...overrides,
});

export const productPayloads = {
  laptop: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "Laptop Pro 16", price: 1499.99, stock: 5, ...overrides }),

  keyboard: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "Mechanical Keyboard", price: 120.00, stock: 15, ...overrides }),

  mouse: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "Wireless Mouse", price: 49.99, stock: 30, ...overrides }),

  monitor: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "4K Monitor", price: 399.00, stock: 3, ...overrides }),

  withSku: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "Product with SKU", price: 50, stock: 5, sku: `SKU-${nextId()}`, ...overrides }),

  withCategory: (categoryId: number, overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ category_id: categoryId, ...overrides }),

  outOfStock: (overrides: Partial<ProductPayload> = {}): ProductPayload =>
    productPayload({ name: "Out of Stock Product", price: 10, stock: 0, availability: false, ...overrides }),
};

/* ---- Invalid variants — para tests de validación ---------- */

export const invalidProductPayloads = {
  missingName:       { price: 100, stock: 1 },
  missingPrice:      { name: "Monitor", stock: 1 },
  missingStock:      { name: "Monitor", price: 200 },
  emptyBody:         {},
  negativPrice:      productPayload({ price: -50 }),
  zeroPrice:         productPayload({ price: 0 }),
  negativeStock:     productPayload({ stock: -1 }),
  emptyName:         productPayload({ name: "" }),
  whitespaceOnlyName: productPayload({ name: "   " }),
};

/* ---- Reset counter for deterministic tests ---------------- */

export const resetProductCounter = (): void => {
  counter = 0;
};
