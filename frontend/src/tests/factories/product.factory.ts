/* ============================================================
   PRODUCT FACTORY — FRONTEND
   Genera objetos Product / ProductFormData consistentes
   para tests de componentes e integración.
   ============================================================ */

import type { Product, Category, ProductFormData } from "../../../features/products/types/products";

let counter = 0;

export const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id:    ++counter,
  name:  `Category ${counter}`,
  color: "#6366f1",
  ...overrides,
});

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id:           ++counter,
  sku:          null,
  name:         `Product ${counter}`,
  description:  null,
  category_id:  null,
  category:     null,
  price:        99.99,
  cost:         null,
  stock:        10,
  availability: true,
  image_url:    null,
  createdAt:    "2025-01-15T10:00:00.000Z",
  updatedAt:    "2025-01-15T10:00:00.000Z",
  ...overrides,
});

export const makeProducts = (count: number, overrides: Partial<Product> = {}): Product[] =>
  Array.from({ length: count }, () => makeProduct(overrides));

export const makeProductFormData = (overrides: Partial<ProductFormData> = {}): ProductFormData => ({
  name:         `Product ${++counter}`,
  price:        99.99,
  stock:        10,
  availability: true,
  ...overrides,
});

export const productVariants = {
  outOfStock:   (overrides: Partial<Product> = {}): Product =>
    makeProduct({ stock: 0, availability: false, ...overrides }),

  withCategory: (category: Category, overrides: Partial<Product> = {}): Product =>
    makeProduct({ category, category_id: category.id, ...overrides }),

  withSku: (overrides: Partial<Product> = {}): Product =>
    makeProduct({ sku: `SKU-${counter}`, ...overrides }),

  expensive: (overrides: Partial<Product> = {}): Product =>
    makeProduct({ price: 9999.99, ...overrides }),

  lowStock: (overrides: Partial<Product> = {}): Product =>
    makeProduct({ stock: 2, ...overrides }),
};

export const resetProductFactory = (): void => {
  counter = 0;
};
