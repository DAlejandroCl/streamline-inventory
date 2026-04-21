/* ============================================================
   UPDATE PRODUCT ACTION
   1. Valida los datos del formulario con Zod.
   2. Si hay errores, los retorna para que el form los muestre
      sin perder los valores que el usuario ya escribió.
   3. Si la validación pasa, llama al API client y redirige.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { updateProduct } from "../lib/api/products";

export async function updateProductAction({
  request,
  params,
}: ActionFunctionArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const formData = await request.formData();

  const data = {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price") ?? 0),
    availability: formData.get("availability") === "on",
  };

  /* VALIDATION */
  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: data,
    };
  }

  /* API CALL */
  try {
    await updateProduct(id, result.data);
  } catch {
    return {
      errors: { general: ["An error occurred while updating the product. Please try again."] },
      values: data,
    };
  }

  return redirect("/products");
}
