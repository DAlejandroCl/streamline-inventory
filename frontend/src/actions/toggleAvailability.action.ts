/* ============================================================
   TOGGLE AVAILABILITY ACTION
   Fix: tipado corregido a ActionFunctionArgs.
   El Referer header puede ser null en algunos navegadores —
   el fallback a /app/products es la ruta segura.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { toggleAvailability } from "../lib/api/products";

export async function toggleAvailabilityAction({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const currentAvailability = formData.get("availability") === "true";

  if (!id) throw new Response("Product ID is required", { status: 400 });

  try {
    await toggleAvailability(id, currentAvailability);
  } catch {
    throw new Response("Failed to toggle availability", { status: 500 });
  }

  const referer = request.headers.get("Referer");
  return redirect(referer ?? "/app/products");
}
