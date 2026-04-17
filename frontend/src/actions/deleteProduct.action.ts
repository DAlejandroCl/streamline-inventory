const API_URL = import.meta.env.VITE_API_URL;

export async function deleteProductAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const id = formData.get("id");

  await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
  });

  return null;
}