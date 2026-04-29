/* ============================================================
   CREATE PRODUCT ACTION
   Envía FormData crudo para preservar el archivo de imagen.
   No hay Content-Type manual — el browser lo setea con el
   boundary correcto para multipart/form-data.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import type { ProductFormData } from "../features/products/types/products";

type ActionResponse = {
  errors?: {
    name?: string[];
    price?: string[];
    cost?: string[];
    stock?: string[];
    general?: string[];
  };
  values?: Partial<ProductFormData>;
};

export async function createProductAction({
  request,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const formData = await request.formData();

  const rawCategoryId = formData.get("category_id");
  const rawCost       = formData.get("cost");

  const data: ProductFormData = {
    name:         String(formData.get("name") ?? ""),
    sku:          String(formData.get("sku") ?? "").trim() || undefined,
    description:  String(formData.get("description") ?? "").trim() || undefined,
    category_id:  rawCategoryId && String(rawCategoryId) !== "" ? Number(rawCategoryId) : null,
    price:        Number(formData.get("price") ?? 0),
    cost:         rawCost && String(rawCost) !== "" ? Number(rawCost) : undefined,
    stock:        Number(formData.get("stock") ?? 0),
    availability: formData.get("availability") === "on",
  };

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: data };
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

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
