import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { updateProduct } from "../lib/api/products";
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

export async function updateProductAction({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const id = params.id;

  if (!id) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const formData = await request.formData();

  const rawAvailability = formData.get("availability");
  const rawCategoryId = formData.get("category_id");
  const rawCost = formData.get("cost");

  const data: Partial<ProductFormData> = {
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    category_id: rawCategoryId ? Number(rawCategoryId) : null,
    price: Number(formData.get("price") ?? 0),
    cost: rawCost ? Number(rawCost) : undefined,
    stock: Number(formData.get("stock") ?? 0),
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
    await updateProduct(id, result.data);
    return redirect("/app/products");
  } catch {
    return {
      errors: { general: ["Error updating product. Please try again."] },
      values: data,
    };
  }
}
