const API_URL = import.meta.env.VITE_API_URL;

export async function toggleAvailabilityAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();

  const id = formData.get("id");
  const availability = formData.get("availability") === "true";

  await fetch(`${API_URL}/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      availability: !availability,
    }),
  });

  return null;
}