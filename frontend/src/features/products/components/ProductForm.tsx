import { Form, useActionData } from "react-router-dom";
import type { ProductFormData } from "../types/products";
import Button from "../../../components/ui/Button";

type ActionErrors = {
  errors?: {
    name?: string[];
    price?: string[];
    availability?: string[];
    general?: string[];
  };
  values?: ProductFormData;
};

type Props = {
  defaultValues?: ProductFormData;
  isEditing?: boolean;
};

export default function ProductForm({ defaultValues, isEditing = false }: Props) {
  const actionData = useActionData() as ActionErrors | undefined;

  return (
    <Form className="bg-white p-6 rounded-xl shadow-md space-y-4" method="post">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          name="name"
          defaultValue={actionData?.values?.name ?? defaultValues?.name}
          className="w-full border p-2 rounded"
        />
        {actionData?.errors?.name && (
          <p className="text-red-500 text-sm">{actionData.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block font-semibold">Price</label>
        <input
          name="price"
          type="number"
          defaultValue={actionData?.values?.price ?? defaultValues?.price}
          className="w-full border p-2 rounded"
        />
        {actionData?.errors?.price && (
          <p className="text-red-500 text-sm">{actionData.errors.price[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="availability"
          defaultChecked={
            actionData?.values?.availability ?? defaultValues?.availability ?? true
          }
        />
        <label>Available</label>
      </div>

      {actionData?.errors?.general && (
        <p className="text-red-600">{actionData.errors.general[0]}</p>
      )}

      <Button type="submit">
        {isEditing ? "Update Product" : "Create Product"}
      </Button>
    </Form>
  );
}