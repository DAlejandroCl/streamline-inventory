/* ============================================================
   PRODUCTS TABLE — COMPONENT TESTS
   Valida comportamiento observable por el usuario, NO
   detalles de implementación interna.

   El componente usa Form/Link de React Router → necesita
   createMemoryRouter (data router) via renderWithProviders.

   Selectores basados en la fuente real del componente:
   - Headers: "Product", "Price", "Stock", "Status", "Added", "Actions"
   - SKU line: `SKU: ${sku}` o `ID #${id}`
   - Badge: "Available" | "Out of stock"
   - Footer: `${n} entries` o `1 entry`
   - Edit button: texto "Edit"
   - Delete button: texto "Delete"
   ============================================================ */

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/helpers/renderWithProviders";
import ProductsTable from "../../components/ProductsTable";
import {
  makeProducts,
  makeProduct,
  productVariants,
  makeCategory,
} from "../../../../tests/factories/product.factory";

describe("ProductsTable", () => {

  /* ---- Headers ------------------------------------------ */

  it("debería renderizar el header 'Product'", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("debería renderizar el header 'Price'", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("debería renderizar el header 'Stock'", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("Stock")).toBeInTheDocument();
  });

  it("debería renderizar el header 'Status'", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("debería renderizar el header 'Actions'", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  /* ---- Renderizado de productos ------------------------- */

  it("debería renderizar el nombre de cada producto", () => {
    const products = [
      makeProduct({ name: "Mechanical Keyboard" }),
      makeProduct({ name: "Wireless Mouse" }),
    ];
    renderWithProviders(<ProductsTable products={products} />, { route: "/app/products" });

    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
  });

  it("debería mostrar 'SKU: KB-001' si el producto tiene SKU", () => {
    const product = makeProduct({ sku: "KB-001" });
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    expect(screen.getByText("SKU: KB-001")).toBeInTheDocument();
  });

  it("debería mostrar 'ID #42' si el producto no tiene SKU", () => {
    const product = makeProduct({ id: 42, sku: null });
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    expect(screen.getByText("ID #42")).toBeInTheDocument();
  });

  /* ---- Badges de status --------------------------------- */

  it("debería mostrar badge 'Available' para producto disponible", () => {
    const product = makeProduct({ availability: true });
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("debería mostrar badge 'Out of stock' para producto no disponible", () => {
    const product = productVariants.outOfStock();
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  /* ---- Stock -------------------------------------------- */

  it("debería mostrar el número de stock correcto", () => {
    const product = makeProduct({ stock: 15 });
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  /* ---- Actions ------------------------------------------ */

  it("debería renderizar botón 'Edit' por cada producto", () => {
    const products = makeProducts(2);
    renderWithProviders(<ProductsTable products={products} />, { route: "/app/products" });
    expect(screen.getAllByText("Edit")).toHaveLength(2);
  });

  it("debería renderizar botón 'Delete' por cada producto", () => {
    const products = makeProducts(2);
    renderWithProviders(<ProductsTable products={products} />, { route: "/app/products" });
    expect(screen.getAllByText("Delete")).toHaveLength(2);
  });

  it("el link de Edit debe apuntar al producto correcto", () => {
    const product = makeProduct({ id: 5 });
    renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" });
    const editLinks = screen.getAllByRole("link");
    const editLink = editLinks.find((l) => l.getAttribute("href")?.includes("/edit"));
    expect(editLink).toBeTruthy();
    expect(editLink?.getAttribute("href")).toBe("/app/products/5/edit");
  });

  /* ---- Footer ------------------------------------------- */

  it("debería mostrar '3 entries' en el footer con 3 productos", () => {
    const products = makeProducts(3);
    renderWithProviders(<ProductsTable products={products} />, { route: "/app/products" });
    expect(screen.getByText("3")).toBeInTheDocument(); // número en negrita
    expect(screen.getByText(/entries/i)).toBeInTheDocument();
  });

  it("debería mostrar '1 entry' (singular) con 1 producto", () => {
    const products = makeProducts(1);
    renderWithProviders(<ProductsTable products={products} />, { route: "/app/products" });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/entry/i)).toBeInTheDocument();
  });

  /* ---- Tabla vacía -------------------------------------- */

  it("debería renderizar la tabla sin filas de datos cuando products es []", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    // Sin productos no hay filas de datos, solo el header row
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);
  });

  it("debería renderizar '0 entries' en el footer para lista vacía", () => {
    renderWithProviders(<ProductsTable products={[]} />, { route: "/app/products" });
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText(/entries/i)).toBeInTheDocument();
  });

  /* ---- Con categoría ------------------------------------ */

  it("debería renderizar un producto con categoría sin errores", () => {
    const category = makeCategory({ name: "Electronics" });
    const product  = productVariants.withCategory(category);
    expect(() =>
      renderWithProviders(<ProductsTable products={[product]} />, { route: "/app/products" })
    ).not.toThrow();
  });

});
