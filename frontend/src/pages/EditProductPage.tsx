import { useLoaderData } from "react-router-dom";
import ProductForm from "../features/products/components/ProductForm";
import type { Product } from "../features/products/types/products";

export default function EditProductPage() {
  const product = useLoaderData() as Product;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <ProductForm
        defaultValues={{
          name: product.name,
          price: product.price,
          availability: product.availability,
        }}
        isEditing
      />
    </div>
  );
}