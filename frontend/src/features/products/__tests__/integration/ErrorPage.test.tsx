/* ============================================================
   ERROR PAGE — INTEGRATION TESTS
   Valida el componente ErrorPage como error boundary de rutas.

   Escenarios:
   - Error 404 → "Record Not Found" + SearchX icon
   - Error 400 → "Invalid Request"
   - Error genérico/500 → "System Error"
   - Botones de recuperación: "Back to home" y "Go to app"
   - Renderizado desde un loader que falla (404 real)
   ============================================================ */

import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../../../tests/msw/server";
import ErrorPage from "../../../../pages/ErrorPage";
import { productByIdLoader } from "../../loaders/products.loader";
import { ThemeProvider } from "../../../../context/ThemeContext";
import { SettingsProvider } from "../../../../context/SettingsContext";
import { NotificationsProvider } from "../../../../context/NotificationsContext";

const API = "http://localhost:3000";

/* ---- Render helpers --------------------------------------- */

// Renderiza ErrorPage directamente como errorElement de una ruta que lanza
function renderWithError(errorToThrow: unknown) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <div>OK</div>,
        errorElement: <ErrorPage />,
        loader: () => { throw errorToThrow; },
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

// Simula un loader de producto que falla con un status específico
function renderProductNotFound(status: number) {
  const router = createMemoryRouter(
    [
      {
        path: "/app/products/:id/edit",
        element: <div data-testid="edit-page">Edit</div>,
        loader: productByIdLoader,
        errorElement: <ErrorPage />,
      },
    ],
    { initialEntries: ["/app/products/999/edit"] }
  );
  server.use(
    http.get(`${API}/api/products/999`, () =>
      HttpResponse.json({ message: "Not found" }, { status })
    )
  );
  return render(
    <ThemeProvider><SettingsProvider><NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider></SettingsProvider></ThemeProvider>
  );
}

/* ============================================================ */

describe("ErrorPage — Integration Tests", () => {

  /* ---- Error 404 ---------------------------------------- */

  it("muestra '404' cuando el error es un Response 404", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() => expect(screen.getByText("404")).toBeInTheDocument());
  });

  it("muestra 'Record Not Found' para error 404", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() =>
      expect(screen.getByText("Record Not Found")).toBeInTheDocument()
    );
  });

  it("muestra el mensaje descriptivo para 404", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() =>
      expect(screen.getByText(/doesn't exist or has been removed/i)).toBeInTheDocument()
    );
  });

  /* ---- Error 400 ---------------------------------------- */

  it("muestra '400' para error 400", async () => {
    renderWithError(new Response("Bad request", { status: 400 }));
    await waitFor(() => expect(screen.getByText("400")).toBeInTheDocument());
  });

  it("muestra 'Invalid Request' para error 400", async () => {
    renderWithError(new Response("Bad request", { status: 400 }));
    await waitFor(() =>
      expect(screen.getByText("Invalid Request")).toBeInTheDocument()
    );
  });

  /* ---- Error genérico ----------------------------------- */

  it("muestra '500' y 'System Error' para error genérico", async () => {
    renderWithError(new Error("Something went wrong"));
    await waitFor(() => {
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("System Error")).toBeInTheDocument();
    });
  });

  it("muestra el mensaje de error genérico descriptivo", async () => {
    renderWithError(new Error("Something went wrong"));
    await waitFor(() =>
      expect(screen.getByText(/unexpected error interrupted/i)).toBeInTheDocument()
    );
  });

  /* ---- Acciones de recuperación ------------------------- */

  it("muestra el link 'Back to home' apuntando a /", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /back to home/i });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  it("muestra el link 'Go to app' apuntando a /app", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /go to app/i });
      expect(link).toHaveAttribute("href", "/app");
    });
  });

  it("muestra la marca 'Streamline' en el footer del error", async () => {
    renderWithError(new Response("Not found", { status: 404 }));
    await waitFor(() =>
      expect(screen.getByText(/Streamline/i)).toBeInTheDocument()
    );
  });

  /* ---- Desde loader real -------------------------------- */

  it("renderiza ErrorPage cuando el productByIdLoader no puede encontrar el producto", async () => {
    // getProductById lanza Error (no Response) cuando el API retorna !ok
    // → ErrorPage muestra "System Error" (500 genérico), no "Record Not Found"
    renderProductNotFound(404);
    await waitFor(() => {
      // El loader lanza Error("Product not found") → ErrorPage lo trata como error genérico
      expect(screen.getByText("System Error")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("renderiza ErrorPage cuando el loader recibe error del servidor", async () => {
    renderProductNotFound(500);
    await waitFor(() => {
      expect(screen.getByText("System Error")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

});
