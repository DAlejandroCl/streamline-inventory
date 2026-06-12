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
    // Reconstruir FormData limpio con solo los campos de texto.
    // Evita que el campo `image` vacío del ImageUpload component
    // cause problemas en el parser multipart de multer en el backend.
    const cleanFormData = new FormData();
    cleanFormData.append("name", data.name);
    if (data.sku)         cleanFormData.append("sku", data.sku);
    if (data.description) cleanFormData.append("description", data.description);
    if (data.category_id != null) cleanFormData.append("category_id", String(data.category_id));
    cleanFormData.append("price", String(data.price));
    if (data.cost != null) cleanFormData.append("cost", String(data.cost));
    cleanFormData.append("stock", String(data.stock));
    cleanFormData.append("availability", data.availability ? "on" : "off");

    // Solo agregar imagen si el usuario seleccionó una
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      cleanFormData.append("image", imageFile);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: "POST",
      credentials: "include",
      body: cleanFormData,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      const msg = body.message ?? "Error creating product.";

      dispatchNotification({
        type: "error",
        title: "Product creation failed",
        description: msg,
      });

      return { errors: { general: [msg] }, values: data };
    }

    dispatchNotification({
      type: "success",
      title: "Product created",
      description: `"${productName}" was added to the inventory ledger.`,
    });

    return redirect("/app/products");
  } catch {
    const msg = "Network error. Please try again.";
    dispatchNotification({
      type: "error",
      title: "Connection error",
      description: msg,
    });
    return { errors: { general: [msg] }, values: data };
  }
}
