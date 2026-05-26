/* ============================================================
   MSW HANDLERS — PRODUCTS
   Intercepta todas las llamadas HTTP al backend en tests.
   La forma de cada respuesta refleja EXACTAMENTE el contrato
   real de la API para que los tests sean fiables.

   Handlers por defecto → happy path.
   Los tests que necesiten error states usan server.use(...)
   dentro del propio test para sobreescribir temporalmente.

   NOTA: El POST handler NO lee el body de la request porque
   el FormData incluye un campo de imagen vacío (ImageUpload)
   que puede causar que MSW se cuelgue intentando parsear
   un File/Blob vacío en el entorno jsdom/Node.js.
   ============================================================ */

import { http, HttpResponse } from "msw";
import type { Product, Category, PaginatedProducts } from "../../../features/products/types/products";

const BASE_URL = "http://localhost:3000/api";

/* ---- Fixtures inline — base data para handlers ----------- */

export const mockCategory: Category = {
  id:    1,
  name:  "Electronics",
  color: "#3b82f6",
};

export const mockProducts: Product[] = [
  {
    id:           1,
    sku:          "KB-001",
    name:         "Mechanical Keyboard",
    description:  "Tenkeyless mechanical keyboard",
    category_id:  1,
    category:     mockCategory,
    price:        120.00,
    cost:         60.00,
    stock:        15,
    availability: true,
    image_url:    null,
    createdAt:    "2025-01-15T10:00:00.000Z",
    updatedAt:    "2025-01-15T10:00:00.000Z",
  },
  {
    id:           2,
    sku:          null,
    name:         "Wireless Mouse",
    description:  null,
    category_id:  null,
    category:     null,
    price:        49.99,
    cost:         null,
    stock:        30,
    availability: true,
    image_url:    null,
    createdAt:    "2025-01-16T10:00:00.000Z",
    updatedAt:    "2025-01-16T10:00:00.000Z",
  },
  {
    id:           3,
    sku:          "MON-4K",
    name:         "4K Monitor",
    description:  "27 inch 4K display",
    category_id:  1,
    category:     mockCategory,
    price:        399.00,
    cost:         200.00,
    stock:        3,
    availability: false,
    image_url:    null,
    createdAt:    "2025-01-17T10:00:00.000Z",
    updatedAt:    "2025-01-17T10:00:00.000Z",
  },
];

export const mockPaginatedResponse: PaginatedProducts = {
  data:       mockProducts,
  total:      3,
  page:       1,
  totalPages: 1,
  hasNext:    false,
  hasPrev:    false,
};

export const productsHandlers = [
  /* ---- GET /api/products (paginado) ---------------------- */
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url    = new URL(request.url);
    const search = url.searchParams.get("search");

    if (search) {
      const filtered = mockProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      return HttpResponse.json({
        data:       filtered,
        total:      filtered.length,
        page:       1,
        totalPages: 1,
        hasNext:    false,
        hasPrev:    false,
      });
    }

    return HttpResponse.json(mockPaginatedResponse);
  }),

  /* ---- GET /api/products/all (sin paginación) ------------ */
  http.get(`${BASE_URL}/products/all`, () => {
    return HttpResponse.json(mockProducts);
  }),

  /* ---- GET /api/products/:id ----------------------------- */
  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const id = Number(params.id);
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  /* ---- POST /api/products --------------------------------
     No leemos el body porque el FormData contiene un campo
     de imagen vacío (ImageUpload) que puede colgar el parsing
     en el entorno de test. Retornamos el mock directamente.  */
  http.post(`${BASE_URL}/products`, () => {
    const newProduct: Product = {
      id:           mockProducts.length + 1,
      sku:          null,
      name:         "New Product",
      description:  null,
      category_id:  null,
      category:     null,
      price:        0,
      cost:         null,
      stock:        0,
      availability: false,
      image_url:    null,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };

    return HttpResponse.json({ data: newProduct }, { status: 201 });
  }),

  /* ---- PUT /api/products/:id ----------------------------- */
  http.put(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const id      = Number(params.id);
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Intentar leer el body — puede ser FormData o JSON
    let updated = { ...product };
    try {
      const body = await request.formData();
      if (body.get("name")) updated.name = String(body.get("name"));
      if (body.get("price")) updated.price = Number(body.get("price"));
      if (body.get("stock")) updated.stock = Number(body.get("stock"));
    } catch {
      try {
        const body = await request.json() as Partial<Product>;
        updated = { ...product, ...body };
      } catch { /* ignore */ }
    }

    return HttpResponse.json({ message: "Product updated", data: updated });
  }),

  /* ---- PATCH /api/products/:id --------------------------- */
  http.patch(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const id      = Number(params.id);
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const body = await request.json() as Partial<Product>;
    const updated = { ...product, ...body };

    return HttpResponse.json({ message: "Product patched", data: updated });
  }),

  /* ---- DELETE /api/products/:id -------------------------- */
  http.delete(`${BASE_URL}/products/:id`, ({ params }) => {
    const id      = Number(params.id);
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json({ message: "Product deleted" });
  }),

  /* ---- GET /api/categories ------------------------------- */
  http.get(`${BASE_URL}/categories`, () => {
    return HttpResponse.json([mockCategory]);
  }),

  /* ---- POST /api/categories ------------------------------ */
  http.post(`${BASE_URL}/categories`, async ({ request }) => {
    const body = await request.json() as { name: string; color?: string };
    return HttpResponse.json(
      { data: { id: 2, name: body.name, color: body.color ?? "#6366f1" } },
      { status: 201 }
    );
  }),
];
