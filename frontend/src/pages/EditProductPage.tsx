import ProductForm from "../components/ProductForm";
import type { ProductFormData } from "../types/products";

export default function EditProductPage() {
  const mockProduct: ProductFormData = {
    name: "Sample Product",
    price: 100,
    availability: true
  };

  const handleSubmit = async (data: ProductFormData) => {
    console.log("update", data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <ProductForm
        defaultValues={mockProduct}
        isEditing
        onSubmit={handleSubmit}
      />
    </div>
  );
}