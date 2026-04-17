import { defer } from "react-router-dom";

export async function productsLoader() {
  try {
    const res = await fetch("http://localhost:4000/api/products");

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    return defer({
      products: data
    });
  } catch (error) {
    throw new Response("Error loading products", { status: 500 });
  }
}