import { Form, useActionData, useNavigation } from "react-router-dom";
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

export default function ProductForm({ defaultValues, isEditing = false }: Props) {
  const actionData = useActionData() as ActionErrors | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form
      method="post"
      className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 shadow-ambient space-y-6"
    >
      {/* PRODUCT NAME */}
      <Input
        id="name"
        name="name"
        type="text"
        label="Product name"
        required
        placeholder="e.g. Wireless Keyboard"
        icon="label"
        defaultValue={actionData?.values?.name ?? defaultValues?.name ?? ""}
        error={actionData?.errors?.name?.[0]}
      />

      {/* PRICE */}
      <Input
        id="price"
        name="price"
        type="number"
        label="Price (USD)"
        required
        placeholder="0.00"
        min={0}
        step="0.01"
        icon="attach_money"
        defaultValue={actionData?.values?.price ?? defaultValues?.price ?? ""}
        error={actionData?.errors?.price?.[0]}
      />

      {/* AVAILABILITY */}
      <div>
        <Label>Availability</Label>
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div className="relative">
            <input
              id="availability"
              type="checkbox"
              name="availability"
              className="sr-only peer"
              defaultChecked={
                actionData?.values?.availability ??
                defaultValues?.availability ??
                true
              }
            />
            <div className="w-10 h-6 bg-[var(--color-surface-container-high)] rounded-full peer-checked:bg-[var(--color-primary)] transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
          </div>
          <span className="text-sm font-medium text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-on-surface)] transition-colors">
            Available for sale
          </span>
        </label>
      </div>

      {/* GENERAL ERROR */}
      {actionData?.errors?.general && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-error-container)]/30 rounded-xl border-l-4 border-[var(--color-error)]">
          <span className="material-symbols-outlined text-[var(--color-error)] text-lg leading-none">
            error
          </span>
          <p className="text-sm text-[var(--color-on-error-container)] font-medium">
            {actionData.errors.general[0]}
          </p>
        </div>
      )}

      {/* SUBMIT */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          icon={isSubmitting ? undefined : isEditing ? "save" : "add"}
          loading={isSubmitting}
        >
          {isSubmitting
            ? isEditing ? "Saving..." : "Creating..."
            : isEditing ? "Save changes" : "Create product"}
        </Button>
      </div>
    </Form>
  );
}
