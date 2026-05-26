/* ============================================================
   NEW PRODUCT PAGE — INTEGRATION TESTS
   Flujo: newProductLoader → render → form → createProductAction

   Scope de estos tests (qué se puede testear confiablemente
   a través del router completo en jsdom):

   ✓ Render: título, campos, categorías del loader, sidebar, link
   ✓ Zod: errores inline visibles sin llamar a la API
   ✓ Estado de carga: "Creating product..." mientras se envía
   ✓ Redirect: navegación a /app/products tras éxito

   Los error scenarios del action (500, 409, network error) 
   se testean en product.action.test.ts directamente sobre la
   función, sin pasar por el router, porque el FormData con el
   campo `image` vacío (ImageUpload) puede causar que el parser
   de MSW quede pendiente en el entorno de Node.js/jsdom.

   TRUCO: jsdom respeta el atributo `required` y bloquea el
   submit con campos vacíos. Para testear Zod con name vacío,
   enviamos un espacio " " → action.trim() → "" → Zod falla.
   ============================================================ */

import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../../../tests/msw/server";
import NewProductPage          from "../../../../pages/NewProductPage";
import { newProductLoader }    from "../../loaders/products.loader";
import { createProductAction } from "../../../../actions/product.actions";
import { ThemeProvider }       from "../../../../context/ThemeContext";
import { SettingsProvider }    from "../../../../context/SettingsContext";
import { NotificationsProvider } from "../../../../context/NotificationsContext";


// Mock ImageUpload para evitar que el campo <input type="file" name="image" />
// vacío cuelgue el parsing de FormData en MSW (entorno Node.js/jsdom).
// En tests solo necesitamos que el formulario funcione sin imagen.
vi.mock("../../../../components/ui/ImageUpload", () => ({
  default: () => <div data-testid="image-upload-mock" />,
}));

const API = "http://localhost:3000";

const MOCK_CREATED = {
  id: 99, sku: null, name: "Mechanical Keyboard", description: null,
  category_id: null, category: null, price: 120, cost: null,
  stock: 15, availability: false, image_url: null,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

/* ---- Router factory --------------------------------------- */
function renderPage() {
  const router = createMemoryRouter(
    [
      {
        path: "/app/products/new",
        element: <NewProductPage />,
        loader: newProductLoader,
        action: createProductAction,
      },
      {
        path: "/app/products",
        element: <div data-testid="products-page">Products</div>,
      },
    ],
    { initialEntries: ["/app/products/new"] }
  );
  return render(
    <ThemeProvider><SettingsProvider><NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider></SettingsProvider></ThemeProvider>
  );
}

/* ---- Helpers --------------------------------------------- */
const hasText = (str: string) => (content: string) => content.includes(str);

async function waitForForm() {
  await waitFor(() =>
    expect(screen.getByPlaceholderText("e.g. Wireless Keyboard")).toBeInTheDocument()
  );
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("e.g. Wireless Keyboard"), "Mechanical Keyboard");
  await user.clear(screen.getByLabelText(/sale price/i));
  await user.type(screen.getByLabelText(/sale price/i), "120");
  await user.clear(screen.getByLabelText(/stock quantity/i));
  await user.type(screen.getByLabelText(/stock quantity/i), "15");
}

/* ============================================================ */

describe("NewProductPage — Integration Tests", () => {

  /* ---- Render inicial ------------------------------------ */

  it("renderiza el título 'New Product Entry'", async () => {
    renderPage();
    await waitFor(() => {
      const items = screen.getAllByText("New Product Entry");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("renderiza todos los campos del formulario", async () => {
    renderPage();
    await waitForForm();
    expect(screen.getByLabelText(/sale price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByText("Create product")).toBeInTheDocument();
  });

  it("carga y muestra las categorías vía loader", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("Electronics")).toBeInTheDocument());
  });

  it("renderiza el sidebar 'Entry Requirements'", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("Entry Requirements")).toBeInTheDocument());
  });

  it("link 'Back to Inventory' apunta a /app/products", async () => {
    renderPage();
    await waitForForm();
    const link = screen.getByRole("link", { name: /back to inventory/i });
    expect(link).toHaveAttribute("href", "/app/products");
  });

  /* ---- Validación Zod (sin llamar a la API) ------------- */

  it("muestra 'Product name is required' cuando name es solo espacios", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForForm();

    // Escribimos " " (espacio) → pasa el atributo `required` del DOM (no es cadena vacía)
    // → el action recibe " " → trim() → "" → ProductSchema.min(1) lanza el error Zod
    const nameInput = screen.getByPlaceholderText("e.g. Wireless Keyboard");
    await user.type(nameInput, " ");
    // Llenar price y stock para que Zod solo falle en name
    const priceInput = screen.getByLabelText(/sale price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "100");
    const stockInput = screen.getByLabelText(/stock quantity/i);
    await user.clear(stockInput);
    await user.type(stockInput, "5");

    await user.click(screen.getByText("Create product"));

    await waitFor(
      () => {
        const errEl = screen.queryByText(hasText("Product name is required"));
        expect(errEl).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("muestra 'Price must be greater than 0' con price vacío", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForForm();
    await user.type(screen.getByPlaceholderText("e.g. Wireless Keyboard"), "Valid Name");
    await user.type(screen.getByLabelText(/stock quantity/i), "5");
    // price vacío → Number("") = 0 → Zod falla
    await user.click(screen.getByText("Create product"));
    await waitFor(() => {
      expect(screen.queryByText(hasText("Price must be greater than 0"))).toBeInTheDocument();
    });
  });

  it("NO navega cuando hay errores Zod", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForForm();
    await user.type(screen.getByPlaceholderText("e.g. Wireless Keyboard"), " ");
    await user.click(screen.getByText("Create product"));
    await waitFor(() => {
      expect(screen.queryByTestId("products-page")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g. Wireless Keyboard")).toBeInTheDocument();
    });
  });

  /* ---- Submit exitoso ----------------------------------- */

  it("navega a /app/products tras submit exitoso", async () => {
    const user = userEvent.setup();
    // Usar server.use explícito: el handler default puede colgarse
    // leyendo el FormData con el campo imagen vacío de ImageUpload
    server.use(
      http.post(`${API}/api/products`, () =>
        HttpResponse.json({ data: MOCK_CREATED }, { status: 201 })
      )
    );
    renderPage();
    await waitForForm();
    await fillValid(user);
    await user.click(screen.getByText("Create product"));
    await waitFor(
      () => expect(screen.getByTestId("products-page")).toBeInTheDocument(),
      { timeout: 4000 }
    );
  });

  /* ---- Estado de carga ---------------------------------- */

  it("muestra 'Creating product...' mientras el form se envía", async () => {
    const user = userEvent.setup();
    let doResolve = (_r: Response) => {};
    const blocker = new Promise<Response>((res) => { doResolve = res; });
    server.use(http.post(`${API}/api/products`, () => blocker));
    renderPage();
    await waitForForm();
    await fillValid(user);
    user.click(screen.getByText("Create product")); // sin await
    await waitFor(() => {
      expect(screen.getByText("Creating product...")).toBeInTheDocument();
    });
    doResolve(HttpResponse.json({ data: MOCK_CREATED }, { status: 201 }));
  });

});
