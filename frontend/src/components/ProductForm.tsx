import { useState } from "react";
import type { ProductFormData } from "../types/products";
import { ProductSchema } from "../schemas/product.schema";

type Props = {
  onSubmit: (data: ProductFormData) => Promise<void>;
  defaultValues?: ProductFormData;
  isEditing?: boolean;
};

export default function ProductForm({
  onSubmit,
  defaultValues,
  isEditing = false
}: Props) {
  const [form, setForm] = useState<ProductFormData>(
    defaultValues ?? {
      name: "",
      price: 0,
      availability: true
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result = ProductSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit(result.data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-bold">
        {isEditing ? "Editar Producto" : "Crear Producto"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name}</p>
      )}

      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={form.price}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      {errors.price && (
        <p className="text-red-500 text-sm">{errors.price}</p>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="availability"
          checked={form.availability}
          onChange={handleChange}
        />
        Disponible
      </label>

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {isEditing ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}