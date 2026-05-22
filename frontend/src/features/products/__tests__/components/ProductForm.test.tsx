/* ============================================================
   PRODUCT FORM — COMPONENT TESTS
   Valida el renderizado y comportamiento del formulario.
   Usa createMemoryRouter vía renderWithProviders porque el
   componente llama a useActionData() y useNavigation().

   Selectores basados en el código fuente real:
   - Name:        placeholder "e.g. Wireless Keyboard"
   - SKU:         placeholder "e.g. WK-001"
   - Description: placeholder "Optional product description..."
   - Price:       label "Sale price (USD)"
   - Stock:       label "Stock quantity"
   - Toggle:      role="switch", aria-label="Toggle product availability"
   - Text toggle: "Available for sale" | "Not available"
   - Submit:      "Create product" | "Save changes"
   ============================================================ */

import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/helpers/renderWithProviders";
import ProductForm from "../../components/ProductForm";
import { makeCategory } from "../../../../tests/factories/product.factory";
import type { Category } from "../../types/products";

const ROUTE = "/app/products/new";

function renderForm(props: React.ComponentProps<typeof ProductForm> = {}) {
  return renderWithProviders(<ProductForm {...props} />, { route: ROUTE });
}

describe("ProductForm", () => {

  /* ---- Campos renderizados ------------------------------ */

  it("debería renderizar el campo 'Product name'", () => {
    renderForm();
    expect(screen.getByPlaceholderText("e.g. Wireless Keyboard")).toBeInTheDocument();
  });

  it("debería renderizar el campo 'SKU'", () => {
    renderForm();
    expect(screen.getByPlaceholderText("e.g. WK-001")).toBeInTheDocument();
  });

  it("debería renderizar el campo 'Description'", () => {
    renderForm();
    expect(screen.getByPlaceholderText("Optional product description...")).toBeInTheDocument();
  });

  it("debería renderizar el campo 'Sale price (USD)'", () => {
    renderForm();
    expect(screen.getByLabelText(/sale price/i)).toBeInTheDocument();
  });

  it("debería renderizar el campo 'Stock quantity'", () => {
    renderForm();
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
  });

  it("debería renderizar el toggle de Availability", () => {
    renderForm();
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
  });

  /* ---- Estado inicial ----------------------------------- */

  it("toggle debe estar 'on' (availability=true) por defecto", () => {
    renderForm();
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("debería mostrar 'Available for sale' por defecto", () => {
    renderForm();
    expect(screen.getByText("Available for sale")).toBeInTheDocument();
  });

  it("toggle debe tener aria-label descriptivo", () => {
    renderForm();
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-label",
      "Toggle product availability"
    );
  });

  /* ---- Interacción con toggle --------------------------- */

  it("al hacer click en toggle debe cambiar a 'Not available'", async () => {
    const user = userEvent.setup();
    renderForm();

    const toggle = screen.getByRole("switch");
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });

  it("al hacer click dos veces en toggle debe volver a 'Available for sale'", async () => {
    const user = userEvent.setup();
    renderForm();

    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Available for sale")).toBeInTheDocument();
  });

  /* ---- Precarga de valores (modo edición) --------------- */

  it("debería precargar el nombre en modo edición", () => {
    renderForm({
      defaultValues: { name: "Loaded Keyboard", price: 120, stock: 5, availability: true },
      isEditing: true,
    });
    expect(screen.getByDisplayValue("Loaded Keyboard")).toBeInTheDocument();
  });

  it("debería precargar el precio en modo edición", () => {
    renderForm({
      defaultValues: { name: "Product", price: 299, stock: 1, availability: true },
      isEditing: true,
    });
    expect(screen.getByDisplayValue("299")).toBeInTheDocument();
  });

  it("debería mostrar 'Not available' cuando defaultValues.availability es false", () => {
    renderForm({
      defaultValues: { name: "Unavailable P", price: 50, stock: 0, availability: false },
    });
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });

  /* ---- Modo creación vs edición ------------------------- */

  it("botón de submit debe decir 'Create product' cuando isEditing=false", () => {
    renderForm({ isEditing: false });
    expect(screen.getByText("Create product")).toBeInTheDocument();
  });

  it("botón de submit debe decir 'Save changes' cuando isEditing=true", () => {
    renderForm({ isEditing: true });
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });

  /* ---- Categorías --------------------------------------- */

  it("debería renderizar las opciones de categorías", () => {
    const categories: Category[] = [
      makeCategory({ id: 1, name: "Electronics" }),
      makeCategory({ id: 2, name: "Furniture" }),
    ];
    renderForm({ categories });

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Furniture")).toBeInTheDocument();
  });

  it("debería mostrar 'No category' como opción por defecto", () => {
    renderForm({ categories: [] });
    expect(screen.getByText("No category")).toBeInTheDocument();
  });

  it("el select de categorías debe tener 'No category' + todas las categorías", () => {
    const categories: Category[] = [
      makeCategory({ id: 1, name: "Cat A" }),
      makeCategory({ id: 2, name: "Cat B" }),
    ];
    renderForm({ categories });

    const select = screen.getByRole("combobox");
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(3); // "No category" + 2
  });

  /* ---- Accesibilidad ------------------------------------ */

  it("el campo 'name' debe tener un label asociado", () => {
    renderForm();
    const input = screen.getByPlaceholderText("e.g. Wireless Keyboard");
    expect(input).toBeInTheDocument();
    // El input debe tener id="name" y el label htmlFor="name"
    expect(input).toHaveAttribute("id", "name");
  });

  it("el campo 'price' debe tener un label asociado", () => {
    renderForm();
    const input = screen.getByLabelText(/sale price/i);
    expect(input).toHaveAttribute("id", "price");
  });

  it("el campo 'stock' debe tener un label asociado", () => {
    renderForm();
    const input = screen.getByLabelText(/stock quantity/i);
    expect(input).toHaveAttribute("id", "stock");
  });

});
