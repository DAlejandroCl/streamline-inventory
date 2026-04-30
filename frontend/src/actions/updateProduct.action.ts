/* ============================================================
   UPDATE PRODUCT ACTION
   Notificación detallada incluye: nombre del producto,
   qué campos cambiaron visiblemente (disponibilidad, stock).
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

export async function updateProductAction({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const id = params.id;
  if (!id) throw new Response("Product ID is required", { status: 400 });

  const formData = await request.formData();

  const rawCategoryId  = formData.get("category_id");
  const rawCost        = formData.get("cost");
  const productName    = String(formData.get("name") ?? "").trim();
  const stock          = Number(formData.get("stock") ?? 0);
  const availability   = formData.get("availability") === "on";

  const data: Partial<ProductFormData> = {
    name:         productName,
    sku:          String(formData.get("sku") ?? "").trim() || undefined,
    description:  String(formData.get("description") ?? "").trim() || undefined,
    category_id:  rawCategoryId && String(rawCategoryId) !== "" ? Number(rawCategoryId) : null,
    price:        Number(formData.get("price") ?? 0),
    cost:         rawCost && String(rawCost) !== "" ? Number(rawCost) : undefined,
    stock,
    availability,
  };

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: data };
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      { method: "PATCH", credentials: "include", body: formData }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { message?: string };
      const msg  = body.message ?? "Error updating product.";

      dispatchNotification({
        type:        "error",
        title:       "Update failed",
        description: `Could not update "${productName}". ${msg}`,
      });

      return { errors: { general: [msg] }, values: data };
    }

    /* Descripción detallada con los cambios más relevantes */
    const statusLabel = availability ? "Available" : "Out of stock";
    dispatchNotification({
      type:        "success",
      title:       "Product updated",
      description: `"${productName}" — Status: ${statusLabel} · Stock: ${stock} units.`,
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
