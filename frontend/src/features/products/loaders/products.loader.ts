/* ============================================================
   PRODUCT LOADERS
   productsLoader: carga la página paginada de productos.
   Lee ?page y ?search de los searchParams de la URL.

   dashboardLoader: carga TODOS los productos sin paginación
   para calcular métricas del Dashboard (valor total, stock, etc.)

   productByIdLoader: carga un producto por ID para el Edit form.
   newProductLoader: carga categorías para el formulario de creación.
   ============================================================ */

import { type LoaderFunctionArgs, redirect } from "react-router-dom";
import type { Product, Category, PaginatedProducts } from "../types/products";
import { getProducts, getAllProducts, getProductById, getCategories } from "../../../lib/api/products";

/* Normaliza campos numéricos que Postgres puede devolver como string */
function normalizeProduct(p: Product): Product {
  return {
    ...p,
    price: parseFloat(String(p.price)) || 0,
    cost:  p.cost != null ? parseFloat(String(p.cost)) : null,
    stock: parseInt(String(p.stock), 10) || 0,
  };
}

/* ---- PRODUCTS (paginado) ---------------------------------- */

export async function productsLoader({
  request,
}: LoaderFunctionArgs): Promise<PaginatedProducts> {
  const url    = new URL(request.url);
  const page   = parseInt(url.searchParams.get("page")   ?? "1",  10) || 1;
  const limit  = parseInt(url.searchParams.get("limit")  ?? "20", 10) || 20;
  const search = url.searchParams.get("search") ?? undefined;

  const result = await getProducts({ page, limit, search });

  return {
    ...result,
    data: result.data.map(normalizeProduct),
  };
}

/* ---- DASHBOARD (sin paginación — métricas completas) ------ */

export async function dashboardLoader(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.map(normalizeProduct);
}

/* ---- NEW PRODUCT ------------------------------------------ */

export async function newProductLoader(): Promise<{ categories: Category[] }> {
  const categories = await getCategories();
  return { categories };
}

/* ---- EDIT PRODUCT ----------------------------------------- */

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
