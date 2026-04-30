/* ============================================================
   TOGGLE AVAILABILITY ACTION
   La notificación muestra el nuevo estado de disponibilidad
   del producto y su nombre (pasado como campo hidden).
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { toggleAvailability } from "../lib/api/products";
import { dispatchNotification } from "../lib/notificationBus";

export async function toggleAvailabilityAction({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const id   = formData.get("id")   as string;
  const name = formData.get("name") as string | null;
  const currentAvailability = formData.get("availability") === "true";

  if (!id) throw new Response("Product ID is required", { status: 400 });

  try {
    await toggleAvailability(id, currentAvailability);
  } catch {
    dispatchNotification({
      type:        "error",
      title:       "Toggle failed",
      description: `Could not change availability for ${name ?? `product #${id}`}.`,
    });
    throw new Response("Failed to toggle availability", { status: 500 });
  }

  const newStatus = !currentAvailability;
  const statusLabel = newStatus ? "Available" : "Out of stock";

  dispatchNotification({
    type:        "success",
    title:       "Availability updated",
    description: name
      ? `"${name}" is now ${statusLabel}.`
      : `Product #${id} is now ${statusLabel}.`,
  });

  const referer = request.headers.get("Referer");
  return redirect(referer ?? "/app/products");
}
