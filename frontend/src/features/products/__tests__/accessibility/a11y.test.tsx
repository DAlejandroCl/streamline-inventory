/* ============================================================
   ACCESSIBILITY TESTS — Fase 3
   Runner: Vitest + axe-core (via vitest-axe)

   Qué valida axe-core:
   - Contraste de color mínimo (WCAG AA)
   - Labels en formularios asociados a inputs
   - Roles ARIA semánticos correctos
   - Estructura de headings (h1 → h2 → h3)
   - Imágenes con alt text
   - Tablas con headers accesibles
   - Botones con texto accesible
   - Focus visible (no detectado por axe en jsdom, se testa en E2E)

   Scope intencional:
   Los tests de a11y validan "no hay violaciones conocidas de axe"
   en los componentes críticos. Son complementarios a los tests
   funcionales — no reemplazan revisión manual ni Lighthouse.

   NOTA sobre colores: axe no puede verificar CSS custom properties
   en jsdom (no hay CSS engine). Los tests de contraste real
   se hacen con Lighthouse o Playwright + axe en el browser real.
   Por eso usamos { rules: { "color-contrast": { enabled: false } } }
   solo para evitar falsos negativos en jsdom, no para ignorar
   el contraste en producción.
   ============================================================ */

import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { run as axeRun, type AxeResults } from "axe-core";
import { ThemeProvider } from "../../../../context/ThemeContext";
import { SettingsProvider } from "../../../../context/SettingsContext";
import { NotificationsProvider } from "../../../../context/NotificationsContext";
import ProductsTable from "../../components/ProductsTable";
import ProductForm from "../../components/ProductForm";
import EmptyState from "../../../../components/ui/EmptyState";
import ErrorPage from "../../../../pages/ErrorPage";
import { makeProducts, makeProduct, makeCategory, productVariants } from "../../../../tests/factories/product.factory";
import type { Category } from "../../types/products";

/* ---- axe config: desactiva color-contrast en jsdom -------- */
// jsdom no renderiza CSS custom properties, causando falsos negativos
// en color contrast. Este check se hace en E2E con browser real.
const AXE_CONFIG = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

/* ---- Mock ImageUpload ------------------------------------- */
vi.mock("../../../../components/ui/ImageUpload", () => ({
  default: () => <div data-testid="image-upload-mock" role="img" aria-label="Product image upload" />,
}));

/* ---- Render helper con data router ----------------------- */
function renderInRouter(ui: React.ReactElement, route = "/app/products") {
  const router = createMemoryRouter(
    [{ path: route, element: ui }, { path: "*", element: <div /> }],
    { initialEntries: [route] }
  );
  return render(
    <ThemeProvider><SettingsProvider><NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider></SettingsProvider></ThemeProvider>
  );
}

/* ---- axe helper ------------------------------------------ */
// axe.run es un singleton — serializar llamadas para evitar
// "Axe is already running" cuando vitest corre tests en paralelo.
let axeRunning = false;
async function runAxe(container: HTMLElement): Promise<AxeResults> {
  while (axeRunning) {
    await new Promise((r) => setTimeout(r, 50));
  }
  axeRunning = true;
  try {
    return await axeRun(container, AXE_CONFIG);
  } finally {
    axeRunning = false;
  }
}

/* ============================================================ */

describe("Accessibility — ProductsTable", () => {

  it("no debe tener violaciones axe con una lista de productos", async () => {
    const products = makeProducts(3);
    const { container } = renderInRouter(
      <ProductsTable products={products} />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con tabla vacía", async () => {
    const { container } = renderInRouter(
      <ProductsTable products={[]} />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con producto sin SKU (ID fallback)", async () => {
    const product = makeProduct({ id: 99, sku: null, name: "Test Product" });
    const { container } = renderInRouter(
      <ProductsTable products={[product]} />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con producto Out of Stock", async () => {
    const product = productVariants.outOfStock({ name: "Unavailable Item" });
    const { container } = renderInRouter(
      <ProductsTable products={[product]} />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con producto con categoría", async () => {
    const category: Category = makeCategory({ name: "Electronics" });
    const product = productVariants.withCategory(category, { name: "Laptop" });
    const { container } = renderInRouter(
      <ProductsTable products={[product]} />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("tabla debe tener role='table' accesible", async () => {
    const { container } = renderInRouter(
      <ProductsTable products={makeProducts(2)} />
    );
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    // La tabla debe tener th headers
    const headers = container.querySelectorAll("th");
    expect(headers.length).toBeGreaterThan(0);
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("botones de acción deben ser accesibles por teclado", async () => {
    const { container } = renderInRouter(
      <ProductsTable products={makeProducts(1)} />
    );
    const buttons = container.querySelectorAll("button");
    // Los botones deben tener texto accesible (no solo iconos)
    for (const btn of buttons) {
      const text = btn.textContent?.trim() ?? "";
      const ariaLabel = btn.getAttribute("aria-label") ?? "";
      expect(
        text.length > 0 || ariaLabel.length > 0,
        `Botón debe tener texto o aria-label: "${text || ariaLabel}"`
      ).toBe(true);
    }
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

});

/* ============================================================ */

describe("Accessibility — ProductForm", () => {

  it("no debe tener violaciones axe en modo creación", async () => {
    const { container } = renderInRouter(
      <ProductForm />,
      "/app/products/new"
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe en modo edición con valores precargados", async () => {
    const { container } = renderInRouter(
      <ProductForm
        defaultValues={{ name: "Keyboard", price: 120, stock: 10, availability: true }}
        isEditing
      />,
      "/app/products/1/edit"
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con categorías cargadas", async () => {
    const categories: Category[] = [
      makeCategory({ id: 1, name: "Electronics" }),
      makeCategory({ id: 2, name: "Furniture" }),
    ];
    const { container } = renderInRouter(
      <ProductForm categories={categories} />,
      "/app/products/new"
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con availability=false", async () => {
    const { container } = renderInRouter(
      <ProductForm
        defaultValues={{ name: "Out", price: 10, stock: 0, availability: false }}
      />,
      "/app/products/new"
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("todos los inputs de texto deben tener labels asociados", async () => {
    const { container } = renderInRouter(
      <ProductForm />,
      "/app/products/new"
    );

    const inputs = container.querySelectorAll("input:not([type='hidden']):not([type='file'])");
    for (const input of inputs) {
      const id = input.getAttribute("id");
      if (!id) continue;
      const label = container.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute("aria-label");
      const ariaLabelledby = input.getAttribute("aria-labelledby");
      expect(
        label !== null || ariaLabel !== null || ariaLabelledby !== null,
        `Input id="${id}" debe tener label, aria-label, o aria-labelledby`
      ).toBe(true);
    }

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("el textarea de description debe tener label accesible", async () => {
    const { container } = renderInRouter(
      <ProductForm />,
      "/app/products/new"
    );
    const textarea = container.querySelector("textarea");
    if (textarea) {
      const id = textarea.getAttribute("id");
      const label = id ? container.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = textarea.getAttribute("aria-label");
      expect(
        label !== null || ariaLabel !== null,
        "Textarea debe tener label o aria-label"
      ).toBe(true);
    }

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("el toggle de availability debe tener role='switch' y aria-checked", async () => {
    const { container } = renderInRouter(
      <ProductForm />,
      "/app/products/new"
    );
    const toggle = container.querySelector("[role='switch']");
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute("aria-checked")).toBeDefined();
    expect(toggle?.getAttribute("aria-label")).toBeTruthy();

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("el select de categorías debe tener label asociado", async () => {
    const categories = [makeCategory({ id: 1, name: "Electronics" })];
    const { container } = renderInRouter(
      <ProductForm categories={categories} />,
      "/app/products/new"
    );
    const select = container.querySelector("select");
    if (select) {
      const id = select.getAttribute("id");
      const label = id ? container.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = select.getAttribute("aria-label");
      expect(
        label !== null || ariaLabel !== null,
        "Select debe tener label o aria-label"
      ).toBe(true);
    }

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

});

/* ============================================================ */

describe("Accessibility — EmptyState", () => {

  it("no debe tener violaciones axe en estado vacío básico", async () => {
    const { container } = renderInRouter(
      <EmptyState
        title="No products yet"
        description="Your inventory is empty."
      />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe con CTA action", async () => {
    const { container } = renderInRouter(
      <EmptyState
        title="No products yet"
        description="Create your first product."
        action={
          <button type="button">Create First Product</button>
        }
      />
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("el heading del empty state debe ser accesible", async () => {
    const { container } = renderInRouter(
      <EmptyState title="No products yet" description="Your inventory is empty." />
    );
    const heading = container.querySelector("h2");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("No products yet");

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

});

/* ============================================================ */

describe("Accessibility — ErrorPage", () => {

  function renderErrorPage(error: unknown) {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <div>OK</div>,
          errorElement: <ErrorPage />,
          loader: () => { throw error; },
        },
      ],
      { initialEntries: ["/"] }
    );
    return render(
      <ThemeProvider><SettingsProvider><NotificationsProvider>
        <RouterProvider router={router} />
      </NotificationsProvider></SettingsProvider></ThemeProvider>
    );
  }

  it("no debe tener violaciones axe en error 404", async () => {
    const { container } = renderErrorPage(
      new Response("Not found", { status: 404 })
    );
    await waitFor(() =>
      expect(screen.getByText("404")).toBeInTheDocument()
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener violaciones axe en error genérico (500)", async () => {
    const { container } = renderErrorPage(new Error("Server error"));
    await waitFor(() =>
      expect(screen.getByText("System Error")).toBeInTheDocument()
    );
    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

  it("los links de recuperación deben ser accesibles", async () => {
    const { container } = renderErrorPage(
      new Response("Not found", { status: 404 })
    );
    await waitFor(() => expect(screen.getByText("404")).toBeInTheDocument());

    const links = container.querySelectorAll("a");
    for (const link of links) {
      const text = link.textContent?.trim() ?? "";
      const ariaLabel = link.getAttribute("aria-label") ?? "";
      expect(
        text.length > 0 || ariaLabel.length > 0,
        `Link debe tener texto accesible: "${text || ariaLabel}"`
      ).toBe(true);
    }

    const results = await runAxe(container);
    expect(results).toHaveNoViolations();
  });

});
