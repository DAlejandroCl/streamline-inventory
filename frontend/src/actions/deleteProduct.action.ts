/* ============================================================
   DELETE PRODUCT ACTION
   Recibe el id del producto desde el FormData del <Form>
   y delega al API client. Si el delete falla, lanza una
   Response para que el errorElement más cercano lo capture.
   ============================================================ */

import { deleteProduct } from "../lib/api/products";

export async function deleteProductAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  try {
    await deleteProduct(id);
  } catch {
    throw new Response("Failed to delete product", { status: 500 });
  }

  return null;
}
