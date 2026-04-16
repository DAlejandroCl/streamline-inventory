import type { Product, ProductFormData } from "../types/products";

const API_URL = "http://localhost:3000/api/products";

export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error creating product");
  }

  return json.data;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error fetching products");
  }

  return json;
}