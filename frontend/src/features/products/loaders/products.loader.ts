/* ============================================================
   PRODUCT LOADERS
   Delegate to the centralized API client.
   No loader builds fetch calls directly.

   productsLoader: returns Product[] with coerced numeric fields.
   newProductLoader: returns { categories } for the new product form.
   productByIdLoader: returns { product, categories } for edit form.
   ============================================================ */

import { type LoaderFunctionArgs } from "react-router-dom";
import type { Product, Category } from "../types/products";
import {
  getProducts,
  getProductById,
  getCategories,
} from "../../../lib/api/products";

/* ============================================================
   Postgres returns numeric columns as strings over JSON in
   some driver configurations. Coerce them here so every
   consumer receives proper JS numbers and avoids $NaN renders.
   ============================================================ */

function normalizeProduct(p: Product): Product {
  return {
    ...p,
    price: parseFloat(String(p.price)) || 0,
    cost:  p.cost != null ? parseFloat(String(p.cost)) : null,
    stock: parseInt(String(p.stock), 10) || 0,
  };
}

/* ---- GET ALL ---------------------------------------------- */

export async function productsLoader(): Promise<Product[]> {
  const products = await getProducts();
  return products.map(normalizeProduct);
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

  return { product: normalizeProduct(product), categories };
}
