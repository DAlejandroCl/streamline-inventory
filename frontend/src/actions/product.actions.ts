/* ============================================================
   CREATE PRODUCT ACTION
   Al crear con éxito dispara una notificación con el nombre
   del producto creado. Si falla, dispara notificación de error.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { dispatchNotification } from "../lib/notificationBus";
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
  const productName   = String(formData.get("name") ?? "").trim();

  const data: ProductFormData = {
    name:         productName,
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
      const msg  = body.message ?? "Error creating product.";

      dispatchNotification({
        type:        "error",
        title:       "Product creation failed",
        description: msg,
      });

      return { errors: { general: [msg] }, values: data };
    }

    dispatchNotification({
      type:        "success",
      title:       "Product created",
      description: `"${productName}" was added to the inventory ledger.`,
    });

    return redirect("/app/products");
  } catch {
    const msg = "Network error. Please try again.";
    dispatchNotification({
      type:        "error",
      title:       "Connection error",
      description: msg,
    });
    return { errors: { general: [msg] }, values: data };
  }
}
