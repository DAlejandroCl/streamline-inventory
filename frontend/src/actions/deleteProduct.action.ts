/* ============================================================
   DELETE PRODUCT ACTION
   Fix: tipado corregido a ActionFunctionArgs de React Router.
   El tipo { request: Request } usaba el Request del DOM
   en lugar del de React Router — causaba errores silenciosos.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { deleteProduct } from "../lib/api/products";

export async function deleteProductAction({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  if (!id) throw new Response("Product ID is required", { status: 400 });

  try {
    await deleteProduct(id);
  } catch {
    throw new Response("Failed to delete product", { status: 500 });
  }

  return redirect("/app/products");
}
