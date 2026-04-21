/* ============================================================
   TOGGLE AVAILABILITY ACTION
   Recibe id y el valor actual de availability desde el
   FormData. Delega al API client que aplica la inversión.
   ============================================================ */

import { toggleAvailability } from "../lib/api/products";

export async function toggleAvailabilityAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const currentAvailability = formData.get("availability") === "true";

  try {
    await toggleAvailability(id, currentAvailability);
  } catch {
    throw new Response("Failed to toggle availability", { status: 500 });
  }

  return null;
}
