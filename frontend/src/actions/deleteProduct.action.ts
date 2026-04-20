import { deleteProduct } from "../lib/api/products";

export async function deleteProductAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  await deleteProduct(id);
  return null;
}