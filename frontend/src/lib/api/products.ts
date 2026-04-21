/* ============================================================
   PRODUCTS API CLIENT
   Única fuente de verdad para todas las llamadas HTTP al API
   de productos. Loaders y actions importan desde aquí — nunca
   construyen fetch calls inline.
   ============================================================ */

import type {
  Product,
  ProductFormData,
} from "../../features/products/types/products";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

/* ---- READ -------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Error fetching products");
  }

  return res.json();
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

/* ---- WRITE ------------------------------------------------- */

export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error creating product");
  }

  return res.json();
}

export async function updateProduct(
  id: string | number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error updating product");
  }

  return res.json();
}

export async function toggleAvailability(
  id: string | number,
  currentAvailability: boolean
): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability: !currentAvailability }),
  });

  if (!res.ok) {
    throw new Error("Error toggling availability");
  }
}

export async function deleteProduct(id: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error deleting product");
  }
}
