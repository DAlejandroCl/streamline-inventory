import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { createProduct } from "../lib/api/products";
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
  const rawCategoryId = formData.get("category_id");
  const rawCost = formData.get("cost");

  const data: ProductFormData = {
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    /*
     * category_id llega como string desde el <select>.
     * Se convierte a number si tiene valor, null si está vacío.
     */
    category_id: rawCategoryId ? Number(rawCategoryId) : null,
    price: Number(formData.get("price") ?? 0),
    /*
     * cost es opcional — solo se incluye si el usuario lo ingresó.
     */
    cost: rawCost ? Number(rawCost) : undefined,
    stock: Number(formData.get("stock") ?? 0),
    /*
     * El toggle controlado envía "on" (available) o "off" (not available)
     * via hidden input. Un checkbox nativo sin marcar envía null.
     */
    availability: rawAvailability === "on",
  };

  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: data,
    };
  }

  try {
    await createProduct(result.data);
    return redirect("/products");
  } catch {
    return {
      errors: { general: ["Error creating product. Please try again."] },
      values: data,
    };
  }
}
