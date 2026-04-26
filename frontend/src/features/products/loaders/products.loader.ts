/* ============================================================
   PRODUCT LOADERS
   Delegan al API client centralizado.
   Ningún loader construye fetch calls directamente.

   productByIdLoader: devuelve { product, categories } para
   que EditProductPage pueda mostrar el selector de categorías.

   newProductLoader: devuelve { categories } para que
   NewProductPage pueda mostrar el selector de categorías.
   ============================================================ */

import { type LoaderFunctionArgs } from "react-router-dom";
import type { Product, Category } from "../types/products";
import {
  getProducts,
  getProductById,
  getCategories,
} from "../../../lib/api/products";

/* ---- GET ALL ---------------------------------------------- */

export async function productsLoader(): Promise<Product[]> {
  return getProducts();
}

/* ---- NEW PRODUCT — needs categories for the selector ------ */

export async function newProductLoader(): Promise<{ categories: Category[] }> {
  const categories = await getCategories();
  return { categories };
}

/* ---- GET BY ID + categories for the edit form ------------- */

export async function productByIdLoader({
  params,
}: LoaderFunctionArgs): Promise<{ product: Product; categories: Category[] }> {
  if (!params.id) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories(),
  ]);

  return { product, categories };
}
