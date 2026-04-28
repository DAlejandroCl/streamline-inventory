/* ============================================================
   CREATE PRODUCT ACTION
   encType="multipart/form-data" en el Form significa que
   React Router serializa los campos de texto normalmente.
   El archivo "image" se envía como parte del multipart body
   y Multer en el backend lo procesa antes del controller.

   No leemos el archivo aquí — solo los campos de texto.
   El backend añade image_url al body después de procesar el file.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import type { ProductFormData } from "../features/products/types/products";

type ActionResponse = {
  errors?: {
    name?: string[];
    sku?: string[];
    description?: string[];
    category_id?: string[];
    price?: string[];
    cost?: string[];
    stock?: string[];
    availability?: string[];
    general?: string[];
  };
  values?: Partial<ProductFormData>;
};

export async function createProductAction({
  request,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const formData = await request.formData();

  const rawAvailability = formData.get("availability");
  const rawCategoryId   = formData.get("category_id");
  const rawCost         = formData.get("cost");

  const data: ProductFormData = {
    name:        String(formData.get("name") ?? ""),
    sku:         String(formData.get("sku") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    category_id: rawCategoryId ? Number(rawCategoryId) : null,
    price:       Number(formData.get("price") ?? 0),
    cost:        rawCost ? Number(rawCost) : undefined,
    stock:       Number(formData.get("stock") ?? 0),
    availability: rawAvailability === "on",
  };

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: data };
  }

  /*
   * Re-enviamos como FormData para preservar el archivo de imagen.
   * fetch con credentials:include envía la cookie de auth.
   */
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { message?: string };
      return {
        errors: { general: [body.message ?? "Error creating product."] },
        values: data,
      };
    }

    return redirect("/app/products");
  } catch {
    return {
      errors: { general: ["Network error. Please try again."] },
      values: data,
    };
  }
}
