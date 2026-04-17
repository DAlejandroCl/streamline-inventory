import { getProducts } from "../../../lib/api/products";

export async function productsLoader() {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    throw new Response("Error loading products", { status: 500 });
  }
}