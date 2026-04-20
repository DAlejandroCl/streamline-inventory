/* ============================================================
   PRODUCT LOADERS
   Use the centralized API client. No fetch calls inline.
   ============================================================ */

import { type LoaderFunctionArgs } from "react-router-dom";
import { getProducts, getProductById } from "../../../lib/api/products";
import type { Product } from "../types/products";

export async function productsLoader(): Promise<Product[]> {
  return getProducts();
}

export async function productByIdLoader({ params }: LoaderFunctionArgs): Promise<Product> {
  if (!params.id) throw new Response("Product ID is required", { status: 400 });
  return getProductById(params.id);
}