/* ============================================================
   PRODUCTS + CATEGORIES API CLIENT
   Single source of truth for all HTTP calls.
   credentials: "include" is required on every request so the
   browser sends the httpOnly auth cookie to the protected API.
   ============================================================ */

import type {
  Product,
  Category,
  ProductFormData,
} from "../../features/products/types/products";

const BASE = import.meta.env.VITE_API_URL;
const PRODUCTS_URL   = `${BASE}/api/products`;
const CATEGORIES_URL = `${BASE}/api/categories`;

/* ---- Shared fetch helper ---------------------------------- */

async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    /*
     * Session expired or cookie missing — redirect to login.
     * This handles the edge case where the cookie expires while
     * the user is actively using the app (e.g. 7-day window passes).
     */
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}

/* ---- PRODUCTS — READ -------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  const res = await apiFetch(PRODUCTS_URL);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

/* ---- PRODUCTS — WRITE ------------------------------------- */

export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await apiFetch(PRODUCTS_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(
  id: string | number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating product");
  return res.json();
}

export async function toggleAvailability(
  id: string | number,
  currentAvailability: boolean
): Promise<void> {
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ availability: !currentAvailability }),
  });
  if (!res.ok) throw new Error("Error toggling availability");
}

export async function deleteProduct(id: string | number): Promise<void> {
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting product");
}

/* ---- CATEGORIES ------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch(CATEGORIES_URL);
  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}

export async function createCategory(data: {
  name: string;
  color?: string;
}): Promise<Category> {
  const res = await apiFetch(CATEGORIES_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating category");
  return res.json();
}

export async function updateCategory(
  id: number,
  data: { name?: string; color?: string }
): Promise<Category> {
  const res = await apiFetch(`${CATEGORIES_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating category");
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await apiFetch(`${CATEGORIES_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting category");
}
