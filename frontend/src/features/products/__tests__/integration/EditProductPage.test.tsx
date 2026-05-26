/* ============================================================
   EDIT PRODUCT PAGE — INTEGRATION TESTS
   Flujo: productByIdLoader → render con datos precargados →
          form → updateProductAction → redirect

   El loader carga en paralelo:
   - GET /api/products/:id → producto existente
   - GET /api/categories   → lista de categorías

   El form recibe defaultValues con los datos del producto.
   El action usa productByIdLoader. El sidebar muestra el
   "Current Record" con los datos del producto cargado.

   vi.mock(ImageUpload) → evita que FormData incluya campo
   imagen vacío que cuelga el parser de MSW.
   ============================================================ */

import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../../../tests/msw/server";
import EditProductPage         from "../../../../pages/EditProductPage";
import { productByIdLoader }   from "../../loaders/products.loader";
import { updateProductAction } from "../../../../actions/updateProduct.action";
import { ThemeProvider }       from "../../../../context/ThemeContext";
import { SettingsProvider }    from "../../../../context/SettingsContext";
import { NotificationsProvider } from "../../../../context/NotificationsContext";
import { mockProducts, mockCategory } from "../../../../tests/msw/handlers/products.handlers";

const API = "http://localhost:3000";

// Mismo fix que en NewProductPage: evitar campo imagen vacío en FormData
vi.mock("../../../../components/ui/ImageUpload", () => ({
  default: () => <div data-testid="image-upload-mock" />,
}));

/* ---- Producto de referencia para los tests --------------- */
const PRODUCT = mockProducts[0]; // id=1, name="Mechanical Keyboard", price=120, stock=15

/* ---- Router factory --------------------------------------- */
function renderEditPage(productId = "1") {
  const router = createMemoryRouter(
    [
      {
        path: "/app/products/:id/edit",
        element: <EditProductPage />,
        loader: productByIdLoader,
        action: updateProductAction,
        errorElement: <div data-testid="error-page">Error</div>,
      },
      {
        path: "/app/products",
        element: <div data-testid="products-page">Products</div>,
      },
    ],
    { initialEntries: [`/app/products/${productId}/edit`] }
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
    expect(screen.getByDisplayValue("Mechanical Keyboard")).toBeInTheDocument()
  , { timeout: 3000 });
}

/* ============================================================ */

describe("EditProductPage — Integration Tests", () => {

  /* ---- Loader: datos precargados ------------------------ */

  it("debería precargar el nombre del producto en el campo name", async () => {
    renderEditPage();
    await waitForForm();
    expect(screen.getByDisplayValue("Mechanical Keyboard")).toBeInTheDocument();
  });

  it("debería precargar el precio del producto", async () => {
    renderEditPage();
    await waitForForm();
    expect(screen.getByDisplayValue("120")).toBeInTheDocument();
  });

  it("debería precargar el stock del producto", async () => {
    renderEditPage();
    await waitForForm();
    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
  });

  it("debería mostrar el título 'Edit Product'", async () => {
    renderEditPage();
    await waitFor(() => {
      const titles = screen.getAllByText("Edit Product");
      expect(titles.length).toBeGreaterThan(0);
    });
  });

  it("debería mostrar el botón 'Save changes' (modo edición)", async () => {
    renderEditPage();
    await waitForForm();
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });

  it("debería mostrar el link 'Back to Inventory'", async () => {
    renderEditPage();
    await waitForForm();
    const link = screen.getByRole("link", { name: /back to inventory/i });
    expect(link).toHaveAttribute("href", "/app/products");
  });

  it("debería renderizar el sidebar con 'Current Record'", async () => {
    renderEditPage();
    await waitFor(() =>
      expect(screen.getByText("Current Record")).toBeInTheDocument()
    );
  });

  it("debería mostrar el ID del producto en el sidebar", async () => {
    renderEditPage();
    await waitFor(() =>
      expect(screen.getByText(`Ledger Entry #${PRODUCT.id}`)).toBeInTheDocument()
    );
  });

  it("debería mostrar las categorías cargadas por el loader", async () => {
    renderEditPage();
    await waitForForm();
    // Electronics aparece en el select de categorías (puede aparecer también en el sidebar)
    const options = screen.getAllByText(mockCategory.name);
    expect(options.length).toBeGreaterThan(0);
  });

  it("debería mostrar el badge de disponibilidad correcto (Available)", async () => {
    renderEditPage();
    await waitFor(() => {
      // El sidebar muestra el status actual del producto
      const badges = screen.getAllByText("Available");
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  /* ---- Loader: 404 --------------------------------------- */

  it("debería mostrar el error page cuando el producto no existe", async () => {
    server.use(
      http.get(`${API}/api/products/999`, () =>
        HttpResponse.json({ message: "Product not found" }, { status: 404 })
      )
    );
    renderEditPage("999");
    await waitFor(() => {
      expect(screen.getByTestId("error-page")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /* ---- Validación Zod en update ------------------------- */

  it("debería mostrar error Zod cuando name se vacía con espacios", async () => {
    const user = userEvent.setup();
    renderEditPage();
    await waitForForm();

    const nameInput = screen.getByDisplayValue("Mechanical Keyboard");
    await user.clear(nameInput);
    await user.type(nameInput, " "); // espacio → trim() → "" → Zod min(1)
    await user.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(
        screen.queryByText(hasText("Product name is required"))
      ).toBeInTheDocument();
    });
  });

  /* ---- Submit exitoso ----------------------------------- */

  it("debería navegar a /app/products tras update exitoso", async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`${API}/api/products/1`, () =>
        HttpResponse.json({
          message: "Product patched",
          data: { ...PRODUCT, name: "Updated Keyboard" },
        })
      )
    );
    renderEditPage();
    await waitForForm();
    await user.click(screen.getByText("Save changes"));

    await waitFor(
      () => expect(screen.getByTestId("products-page")).toBeInTheDocument(),
      { timeout: 4000 }
    );
  });

  /* ---- Estado de carga ---------------------------------- */

  it("debería mostrar 'Saving changes...' mientras el update se envía", async () => {
    const user = userEvent.setup();
    let doResolve = (_r: Response) => {};
    const blocker = new Promise<Response>((res) => { doResolve = res; });
    server.use(http.patch(`${API}/api/products/1`, () => blocker));

    renderEditPage();
    await waitForForm();
    user.click(screen.getByText("Save changes")); // sin await

    await waitFor(() =>
      expect(screen.getByText("Saving changes...")).toBeInTheDocument()
    );

    doResolve(HttpResponse.json({ message: "ok", data: PRODUCT }));
  });

});
