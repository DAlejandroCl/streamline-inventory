/* ============================================================
   PRODUCT FORM
   Compartido entre NewProductPage y EditProductPage.
   Usa los componentes del design system (Label, Input, Button)
   en lugar de elementos HTML raw para consistencia visual.
   ============================================================ */

import { Form, useActionData } from "react-router-dom";
import type { ProductFormData } from "../types/products";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Label from "../../../components/ui/Label";

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

export default function ProductForm({
  defaultValues,
  isEditing = false,
}: Props) {
  const actionData = useActionData() as ActionErrors | undefined;

  return (
    <Form className="bg-white p-6 rounded-xl shadow-md space-y-5" method="post">

      {/* PRODUCT NAME */}
      <div>
        <Label htmlFor="name" required>
          Product name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Wireless Keyboard"
          defaultValue={actionData?.values?.name ?? defaultValues?.name ?? ""}
          error={actionData?.errors?.name?.[0]}
        />
      </div>

      {/* PRICE */}
      <div>
        <Label htmlFor="price" required>
          Price (USD)
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="0.00"
          min={0}
          step="0.01"
          defaultValue={actionData?.values?.price ?? defaultValues?.price ?? ""}
          error={actionData?.errors?.price?.[0]}
        />
      </div>

      {/* AVAILABILITY */}
      <div className="flex items-center gap-3">
        <input
          id="availability"
          type="checkbox"
          name="availability"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          defaultChecked={
            actionData?.values?.availability ??
            defaultValues?.availability ??
            true
          }
        />
        <Label htmlFor="availability" className="mb-0 cursor-pointer">
          Available for sale
        </Label>
      </div>

      {/* GENERAL ERROR */}
      {actionData?.errors?.general && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {actionData.errors.general[0]}
        </p>
      )}

      {/* SUBMIT */}
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit">
          {isEditing ? "Update product" : "Create product"}
        </Button>
      </div>
    </Form>
  );
}
