import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { updateProduct } from "../lib/api/products";

export async function updateProductAction({ request, params }: ActionFunctionArgs) {
  if (!params.id) throw new Response("Product ID is required", { status: 400 });

  const formData = await request.formData();
  const data = {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price") ?? 0),
    availability: formData.get("availability") === "on",
  };

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: data };
  }

  try {
    await updateProduct(params.id, result.data);
    return redirect("/products");
  } catch {
    return { errors: { general: ["Error updating product"] }, values: data };
  }
}