import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { createProduct } from "../lib/api/products";
import type { ProductFormData } from "../features/products/types/products";

type ActionResponse = {
  errors?: {
    name?: string[];
    price?: string[];
    availability?: string[];
    general?: string[];
  };
  values?: ProductFormData;
};

export async function createProductAction({
  request,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const formData = await request.formData();

  const rawAvailability = formData.get("availability");

  const data: ProductFormData = {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price") ?? 0),
    /*
     * El toggle controlado envía un hidden input con "on" (available)
     * o "off" (not available). Un checkbox nativo sin marcar no envía
     * nada — por eso el fallback cubre ambos casos.
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
