/* ============================================================
   PRODUCT LOADERS
   Delegan al API client centralizado.
   Ningún loader construye fetch calls directamente.
   ============================================================ */

import { type LoaderFunctionArgs } from "react-router-dom";
import type { Product } from "../types/products";
import { getProducts, getProductById } from "../../../lib/api/products";

/* ---- GET ALL ---------------------------------------------- */

export async function productsLoader(): Promise<Product[]> {
  return getProducts();
}

/* ---- GET BY ID -------------------------------------------- */

export async function productByIdLoader({
  params,
}: LoaderFunctionArgs): Promise<Product> {
  if (!params.id) {
    throw new Response("Product ID is required", { status: 400 });
  }

  return getProductById(params.id);
}
