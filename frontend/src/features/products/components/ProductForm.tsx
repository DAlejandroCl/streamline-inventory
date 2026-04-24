import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Tag, DollarSign, Save, Plus, Hash, Package, AlignLeft, Layers, TrendingDown } from "lucide-react";
import type { ProductFormData, Category } from "../types/products";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Label from "../../../components/ui/Label";

type ActionErrors = {
  errors?: {
    name?: string[];
    sku?: string[];
    description?: string[];
    category_id?: string[];
    price?: string[];
    cost?: string[];
    stock?: string[];
    availability?: string[];
    general?: string[];
  };
  values?: Partial<ProductFormData>;
};

type Props = {
  defaultValues?: ProductFormData;
  isEditing?: boolean;
  categories?: Category[];
};

export default function ProductForm({
  defaultValues,
  isEditing = false,
  categories = [],
}: Props) {
  const actionData = useActionData() as ActionErrors | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [available, setAvailable] = useState<boolean>(
    actionData?.values?.availability ?? defaultValues?.availability ?? true
  );

  return (
    <Form
      method="post"
      className="bg-[var(--color-surface)] rounded-2xl p-8 shadow-card border border-[var(--color-border)]/40 space-y-6"
    >
      {/* ROW 1 — Name + SKU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
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
        </div>
        <Input
          id="sku"
          name="sku"
          type="text"
          label="SKU"
          placeholder="e.g. WK-001"
          icon={Hash}
          defaultValue={actionData?.values?.sku ?? defaultValues?.sku ?? ""}
          error={actionData?.errors?.sku?.[0]}
          hint="Optional internal code"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <AlignLeft
            size={15}
            className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none"
            strokeWidth={2}
          />
          <textarea
            id="description"
            name="description"
            placeholder="Optional product description..."
            rows={3}
            defaultValue={actionData?.values?.description ?? defaultValues?.description ?? ""}
            className={[
              "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl resize-none",
              "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
              "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white",
              "transition-all duration-200",
            ].join(" ")}
          />
        </div>
        {actionData?.errors?.description && (
          <p className="text-xs text-[var(--color-error)]">{actionData.errors.description[0]}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div className="space-y-1.5">
        <Label htmlFor="category_id">Category</Label>
        <div className="relative">
          <Layers
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            strokeWidth={2}
          />
          <select
            id="category_id"
            name="category_id"
            defaultValue={actionData?.values?.category_id ?? defaultValues?.category_id ?? ""}
            className={[
              "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl appearance-none",
              "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
              "text-[var(--color-text-primary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)]",
              "transition-all duration-200",
            ].join(" ")}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ROW 2 — Price + Cost + Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="price"
          name="price"
          type="number"
          label="Sale price (USD)"
          required
          placeholder="0.00"
          min={0}
          step="0.01"
          icon={DollarSign}
          defaultValue={actionData?.values?.price ?? defaultValues?.price ?? ""}
          error={actionData?.errors?.price?.[0]}
        />
        <Input
          id="cost"
          name="cost"
          type="number"
          label="Cost price"
          placeholder="0.00"
          min={0}
          step="0.01"
          icon={TrendingDown}
          defaultValue={actionData?.values?.cost ?? defaultValues?.cost ?? ""}
          error={actionData?.errors?.cost?.[0]}
          hint="For margin calculation"
        />
        <Input
          id="stock"
          name="stock"
          type="number"
          label="Stock quantity"
          required
          placeholder="0"
          min={0}
          step="1"
          icon={Package}
          defaultValue={actionData?.values?.stock ?? defaultValues?.stock ?? 0}
          error={actionData?.errors?.stock?.[0]}
        />
      </div>

      {/* AVAILABILITY TOGGLE — controlled */}
      <div>
        <Label>Availability</Label>
        <input type="hidden" name="availability" value={available ? "on" : "off"} />

        <button
          type="button"
          role="switch"
          aria-checked={available}
          aria-label="Toggle product availability"
          onClick={() => setAvailable((prev) => !prev)}
          className="flex items-center gap-3 cursor-pointer group w-fit rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2"
        >
          <div
            className={[
              "relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shrink-0",
              available
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-surface-high)] border border-[var(--color-border)]",
            ].join(" ")}
          >
            <div
              className={[
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md",
                "transition-transform duration-300 ease-in-out",
                available ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </div>
          <span
            className={[
              "text-sm font-semibold transition-colors duration-200 select-none",
              available
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]",
            ].join(" ")}
          >
            {available ? "Available for sale" : "Not available"}
          </span>
        </button>
      </div>

      {/* GENERAL ERROR */}
      {actionData?.errors?.general && (
        <div className="flex items-start gap-3 px-4 py-3 bg-[var(--color-error-container)]/40 rounded-xl border-l-4 border-[var(--color-error)]">
          <p className="text-sm text-[var(--color-on-error-container)] font-medium">
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
