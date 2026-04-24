/* ============================================================
   PRODUCTS + CATEGORIES API CLIENT
   Única fuente de verdad para todas las llamadas HTTP.
   Loaders y actions importan desde aquí — nunca construyen
   fetch calls inline ni duplican la base URL.
   ============================================================ */

import type {
  Product,
  Category,
  ProductFormData,
} from "../../features/products/types/products";

const BASE = import.meta.env.VITE_API_URL;
const PRODUCTS_URL = `${BASE}/api/products`;
const CATEGORIES_URL = `${BASE}/api/categories`;

/* ---- PRODUCTS — READ -------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${PRODUCTS_URL}/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

/* ---- PRODUCTS — WRITE ------------------------------------- */

export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await fetch(PRODUCTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(
  id: string | number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const res = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating product");
  return res.json();
}

export async function toggleAvailability(
  id: string | number,
  currentAvailability: boolean
): Promise<void> {
  const res = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability: !currentAvailability }),
  });
  if (!res.ok) throw new Error("Error toggling availability");
}

export async function deleteProduct(id: string | number): Promise<void> {
  const res = await fetch(`${PRODUCTS_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting product");
}

/* ---- CATEGORIES ------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(CATEGORIES_URL);
  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}

export async function createCategory(data: {
  name: string;
  color?: string;
}): Promise<Category> {
  const res = await fetch(CATEGORIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating category");
  return res.json();
}

export async function updateCategory(
  id: number,
  data: { name?: string; color?: string }
): Promise<Category> {
  const res = await fetch(`${CATEGORIES_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating category");
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${CATEGORIES_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting category");
}
