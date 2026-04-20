import { toggleAvailability } from "../lib/api/products";

export async function toggleAvailabilityAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const availability = formData.get("availability") === "true";
  await toggleAvailability(id, availability);
  return null;
}