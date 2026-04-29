/* ============================================================
   TOGGLE AVAILABILITY ACTION
   redirect al referer o a /app/products para que React Router
   no quede en la ruta action-only con outlet vacío.
   ============================================================ */

import { redirect } from "react-router-dom";
import { toggleAvailability } from "../lib/api/products";

export async function toggleAvailabilityAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const currentAvailability = formData.get("availability") === "true";

  try {
    await toggleAvailability(id, currentAvailability);
  } catch {
    throw new Response("Failed to toggle availability", { status: 500 });
  }

  /* Redirect back to the page that submitted the form */
  const referer = request.headers.get("Referer");
  return redirect(referer ?? "/app/products");
}
