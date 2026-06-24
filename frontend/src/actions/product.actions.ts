/* ============================================================
   CREATE PRODUCT ACTION
   Fix: cuando no hay imagen se envía JSON en lugar de
   multipart/form-data para evitar que busboy/multer se cuelgue
   en CI con requests multipart de solo texto.
   express.json() parsea el body antes de que multer corra;
   multer ignora Content-Type != multipart y llama next().
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
  const rawCost = formData.get("cost");
  const productName = String(formData.get("name") ?? "").trim();

  const data: ProductFormData = {
    name: productName,
    sku: String(formData.get("sku") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    category_id:
      rawCategoryId && String(rawCategoryId) !== ""
        ? Number(rawCategoryId)
        : null,
    price: Number(formData.get("price") ?? 0),
    cost: rawCost && String(rawCost) !== "" ? Number(rawCost) : undefined,
    stock: Number(formData.get("stock") ?? 0),
    availability: formData.get("availability") === "on",
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
      fd.append("name", data.name);
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
      // Sin imagen → JSON: evita que busboy/multer se cuelgue en CI con
      // requests multipart de solo texto (Playwright + multer streaming bug).
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

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method:      "POST",
      credentials: "include",
      headers,
      body,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      const msg = body.message ?? "Error creating product.";

      dispatchNotification({
        type:  "error",
        title: "Product creation failed",
        description: msg,
      });

      return { errors: { general: [msg] }, values: data };
    }

    dispatchNotification({
      type:  "success",
      title: "Product created",
      description: `"${productName}" was added to the inventory ledger.`,
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
