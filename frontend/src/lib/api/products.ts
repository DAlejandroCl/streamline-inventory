import type { Product } from "../../features/products/types/products";

const API_URL = "http://localhost:3000/api/products";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Error fetching products");
  }

  const data = await res.json();
  return data;
}