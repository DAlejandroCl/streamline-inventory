import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { updateProduct } from "../lib/api/products";
import type { ProductFormData } from "../features/products/types/products";

type ActionResponse = {
  errors?: {
    name?: string[];
    price?: string[];
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

  const data = {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price") ?? 0),
    /*
     * Mismo parsing que createProductAction — el hidden input del
     * toggle controlado envía "on" o "off", nunca null.
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
    await updateProduct(id, result.data);
    return redirect("/products");
  } catch {
    return {
      errors: { general: ["Error updating product. Please try again."] },
      values: data,
    };
  }
}
