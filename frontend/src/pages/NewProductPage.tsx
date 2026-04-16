import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/products";
import type { ProductFormData } from "../types/products";

export default function NewProductPage() {
  const handleSubmit = async (data: ProductFormData) => {
    await createProduct(data);
    alert("Producto creado");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Product</h1>

      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}