import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";
import { createProduct } from "../api/products";

export async function createProductAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    availability: formData.get("availability") === "on"
  };

  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: data
    };
  }

  try {
    await createProduct(result.data);
    return redirect("/products");
  } catch {
    return {
      errors: {
        general: ["Error creating product"]
      },
      values: data
    };
  }
}