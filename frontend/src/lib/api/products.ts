/* ============================================================
   PRODUCTS + CATEGORIES API CLIENT
   getProducts: ahora acepta opciones de paginación y búsqueda.
   getAllProducts: llama a /api/products/all (sin paginación)
   — usado por el Dashboard para métricas completas.
   ============================================================ */

import type {
  Product,
  Category,
  ProductFormData,
  PaginatedProducts,
} from "../../features/products/types/products";

const BASE          = import.meta.env.VITE_API_URL;
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
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}

/* ---- Pagination options ----------------------------------- */

export type ProductQueryOptions = {
  page?:   number;
  limit?:  number;
  search?: string;
};

/* ---- PRODUCTS — READ -------------------------------------- */

export async function getProducts(
  opts: ProductQueryOptions = {}
): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (opts.page)   params.set("page",   String(opts.page));
  if (opts.limit)  params.set("limit",  String(opts.limit));
  if (opts.search) params.set("search", opts.search);

  const url = params.toString()
    ? `${PRODUCTS_URL}?${params.toString()}`
    : PRODUCTS_URL;

  const res = await apiFetch(url);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

/* Sin paginación — Dashboard métricas */
export async function getAllProducts(): Promise<Product[]> {
  const res = await apiFetch(`${PRODUCTS_URL}/all`);
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
