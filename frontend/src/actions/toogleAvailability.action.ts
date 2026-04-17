export async function toggleAvailabilityAction({
  request
}: {
  request: Request;
}) {
  const formData = await request.formData();

  const id = formData.get("id");
  const availability = formData.get("availability") === "true";

  if (!id) {
    throw new Response("Invalid product ID", { status: 400 });
  }

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        availability: !availability
      })
    });

    return null;
  } catch {
    throw new Response("Error updating product", { status: 500 });
  }
}