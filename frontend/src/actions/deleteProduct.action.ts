export async function deleteProductAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (!id) {
    throw new Response("Invalid product ID", { status: 400 });
  }

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      method: "DELETE"
    });

    return null;
  } catch {
    throw new Response("Error deleting product", { status: 500 });
  }
}