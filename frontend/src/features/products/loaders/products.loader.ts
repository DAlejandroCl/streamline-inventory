import { type LoaderFunctionArgs } from "react-router-dom";
import type { Product } from "../types/products";

const API_URL = import.meta.env.VITE_API_URL;

// 🔹 GET ALL PRODUCTS
export async function productsLoader(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);

  if (!res.ok) {
    throw new Response("Failed to fetch products", { status: 500 });
  }

  return res.json();
}

// 🔹 GET PRODUCT BY ID
export async function productByIdLoader({
  params,
}: LoaderFunctionArgs): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products/${params.id}`);

  if (!res.ok) {
    throw new Response("Product not found", { status: 404 });
  }

  return res.json();
}