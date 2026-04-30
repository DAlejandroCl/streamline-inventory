/* ============================================================
   DELETE PRODUCT ACTION
   Notifica con el ID del producto eliminado (el nombre no está
   disponible en el FormData del botón Delete de la tabla —
   solo se envía el id). Se puede mejorar en el futuro pasando
   el nombre como campo hidden en el Form.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { deleteProduct } from "../lib/api/products";
import { dispatchNotification } from "../lib/notificationBus";

export async function deleteProductAction({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const id   = formData.get("id")   as string;
  const name = formData.get("name") as string | null;

  if (!id) throw new Response("Product ID is required", { status: 400 });

  try {
    await deleteProduct(id);
  } catch {
    dispatchNotification({
      type:        "error",
      title:       "Delete failed",
      description: `Could not remove product #${id} from the ledger.`,
    });
    throw new Response("Failed to delete product", { status: 500 });
  }

  dispatchNotification({
    type:        "success",
    title:       "Product deleted",
    description: name
      ? `"${name}" was permanently removed from the inventory.`
      : `Product #${id} was permanently removed from the inventory.`,
  });

  return redirect("/app/products");
}
