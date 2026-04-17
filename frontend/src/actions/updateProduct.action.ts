import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { ProductSchema } from "../schemas/product.schema";

const API_URL = import.meta.env.VITE_API_URL;

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
    name: formData.get("name"),
    price: Number(formData.get("price")),
    availability: formData.get("availability") === "on",
  };

  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: data,
    };
  }

  await fetch(`${API_URL}/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  });

  return redirect("/products");
}