import { Form, useActionData, useNavigation } from "react-router-dom";
import { DollarSign, Tag, Save, Plus } from "lucide-react";
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
      className="bg-[var(--color-surface) rounded-2xl p-8 shadow-card border border-[var(--color-border)/40 space-y-6"
    >
      {/* NAME */}
      <Input
        id="name"
        name="name"
        type="text"
        label="Product name"
        required
        placeholder="e.g. Wireless Keyboard"
        icon={Tag}
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
        icon={DollarSign}
        defaultValue={actionData?.values?.price ?? defaultValues?.price ?? ""}
        error={actionData?.errors?.price?.[0]}
      />

      {/* AVAILABILITY TOGGLE */}
      <div>
        <Label>Availability</Label>
        <label className="flex items-center gap-3 cursor-pointer w-fit group">
          <div className="relative">
            <input
              type="checkbox"
              name="availability"
              className="sr-only peer"
              defaultChecked={actionData?.values?.availability ?? defaultValues?.availability ?? true}
            />
            <div className="w-11 h-6 bg-[var(--color-surface-high) border border-[var(--color-border) rounded-full peer-checked:bg-[var(--color-primary) peer-checked:border-transparent transition-all duration-200" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 peer-checked:translate-x-5" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-secondary) group-hover:text-[var(--color-text-primary) transition-colors">
            Available for sale
          </span>
        </label>
      </div>

      {/* GENERAL ERROR */}
      {actionData?.errors?.general && (
        <div className="flex items-start gap-3 px-4 py-3 bg-[var(--color-error-container)/40 rounded-xl border-l-4 border-[var(--color-error)">
          <p className="text-sm text-[var(--color-on-error-container) font-medium">
            {actionData.errors.general[0]}
          </p>
        </div>
      )}

      {/* SUBMIT */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          icon={isSubmitting ? undefined : isEditing ? Save : Plus}
          loading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? isEditing ? "Saving changes..." : "Creating product..."
            : isEditing ? "Save changes" : "Create product"}
        </Button>
      </div>
    </Form>
  );
}
