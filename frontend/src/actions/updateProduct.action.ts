/* ============================================================
   UPDATE PRODUCT ACTION
   Fix: mismo patrón que createProductAction — JSON cuando no
   hay imagen para evitar el cuelgue de busboy/multer en CI.
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

  const rawCategoryId = formData.get("category_id");
  const rawCost       = formData.get("cost");
  const productName   = String(formData.get("name") ?? "").trim();
  const stock         = Number(formData.get("stock") ?? 0);
  const availability  = formData.get("availability") === "on";

  const data: Partial<ProductFormData> = {
    name: productName,
    sku:         String(formData.get("sku") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    category_id:
      rawCategoryId && String(rawCategoryId) !== ""
        ? Number(rawCategoryId)
        : null,
    price: Number(formData.get("price") ?? 0),
    cost:  rawCost && String(rawCost) !== "" ? Number(rawCost) : undefined,
    stock,
    availability,
  };

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: data };
  }

  try {
    const imageFile = formData.get("image") as File | null;
    const hasImage  = imageFile instanceof File && imageFile.size > 0;

    let body: BodyInit;
    let headers: Record<string, string> | undefined;

    if (hasImage) {
      // Con imagen → multipart/form-data; multer la procesa con sharp
      const fd = new FormData();
      fd.append("name", data.name!);
      if (data.sku)                 fd.append("sku",         data.sku);
      if (data.description)         fd.append("description", data.description);
      if (data.category_id != null) fd.append("category_id", String(data.category_id));
      fd.append("price",        String(data.price));
      if (data.cost != null)        fd.append("cost",        String(data.cost));
      fd.append("stock",        String(data.stock));
      fd.append("availability", data.availability ? "on" : "off");
      fd.append("image",        imageFile);
      body = fd;
    } else {
      // Sin imagen → JSON: evita el cuelgue de busboy/multer en CI.
      body    = JSON.stringify({
        name:         data.name,
        sku:          data.sku,
        description:  data.description,
        category_id:  data.category_id,
        price:        data.price,
        cost:         data.cost,
        stock:        data.stock,
        availability: data.availability ? "on" : "off",
      });
      headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
        method:      "PUT",
        credentials: "include",
        headers,
        body,
      }
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      const msg = body.message ?? "Error updating product.";

      dispatchNotification({
        type:  "error",
        title: "Update failed",
        description: `Could not update "${productName}". ${msg}`,
      });

      return { errors: { general: [msg] }, values: data };
    }

    const statusLabel = availability ? "Available" : "Out of stock";
    dispatchNotification({
      type:  "success",
      title: "Product updated",
      description: `"${productName}" — Status: ${statusLabel} · Stock: ${stock} units.`,
    });

    return redirect("/app/products");
  } catch {
    const msg = "Network error. Please try again.";
    dispatchNotification({
      type:  "error",
      title: "Connection error",
      description: msg,
    });
    return { errors: { general: [msg] }, values: data };
  }
}
