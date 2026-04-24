import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Tag, DollarSign, Save, Plus } from "lucide-react";
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

  /*
   * FIX: el toggle debe ser CONTROLADO con useState.
   *
   * Root cause del bug:
   * - defaultChecked es uncontrolled — React lo aplica solo en el
   *   mount inicial y nunca más. Si el valor cambia (re-render,
   *   action data), el DOM no se actualiza.
   * - El CSS peer-checked solo funciona cuando el checkbox nativo
   *   está en el DOM con :checked real, no con un estado de React.
   *
   * Solución:
   * - useState controla el valor booleano visible
   * - <button type="button"> reemplaza el checkbox nativo
   * - <input type="hidden"> envía el valor al FormData de React Router
   * - El track/thumb se colorean con clases condicionales directas,
   *   sin depender de :checked del navegador
   */
  const [available, setAvailable] = useState<boolean>(
    actionData?.values?.availability ?? defaultValues?.availability ?? true
  );

  return (
    <Form
      method="post"
      className="bg-[var(--color-surface)] rounded-2xl p-8 shadow-card border border-[var(--color-border)]/40 space-y-6"
    >
      {/* PRODUCT NAME */}
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

        {/*
         * Input hidden — garantiza que el FormData de React Router
         * siempre tenga "availability" independientemente del estado
         * del botón. El action lee este valor, no el checkbox nativo.
         */}
        <input
          type="hidden"
          name="availability"
          value={available ? "on" : "off"}
        />

        <button
          type="button"
          role="switch"
          aria-checked={available}
          aria-label="Toggle product availability"
          onClick={() => setAvailable((prev) => !prev)}
          className="flex items-center gap-3 cursor-pointer group w-fit rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2"
        >
          {/* TRACK */}
          <div
            className={[
              "relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shrink-0",
              available
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-surface-high)] border border-[var(--color-border)]",
            ].join(" ")}
          >
            {/* THUMB */}
            <div
              className={[
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md",
                "transition-transform duration-300 ease-in-out",
                available ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </div>

          {/* STATUS LABEL — changes with state */}
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
            ? isEditing
              ? "Saving changes..."
              : "Creating product..."
            : isEditing
            ? "Save changes"
            : "Create product"}
        </Button>
      </div>
    </Form>
  );
}
