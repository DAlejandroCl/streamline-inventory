/* ============================================================
   DELETE PRODUCT ACTION
   redirect("/app/products") es necesario — sin él React Router
   renderiza el outlet vacío de la ruta action-only.
   ============================================================ */

import { redirect } from "react-router-dom";
import { deleteProduct } from "../lib/api/products";

export async function deleteProductAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  try {
    await deleteProduct(id);
  } catch {
    throw new Response("Failed to delete product", { status: 500 });
  }

  return redirect("/app/products");
}
