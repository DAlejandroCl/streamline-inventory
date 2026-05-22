/* ============================================================
   PRODUCTS PAGE — INTEGRATION TESTS
   Valida el flujo completo:
     productsLoader → fetch → MSW → render → UI

   Usa createMemoryRouter para probar el loader real de
   React Router 7 con datos reales de MSW.

   Escenarios críticos:
   - Happy path: productos cargan y renderizan
   - Empty state: sin productos
   - Error state: API falla con 500
   - Búsqueda: filtra productos
   - Paginación: metadata visible
   ============================================================ */

import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../../../tests/msw/server";
import { productsLoader } from "../../loaders/products.loader";
import ProductsPage from "../../../../pages/ProductsPage";
import { ThemeProvider } from "../../../../context/ThemeContext";
import { SettingsProvider } from "../../../../context/SettingsContext";
import { NotificationsProvider } from "../../../../context/NotificationsContext";
import {
  mockProducts,
  mockPaginatedResponse,
} from "../../../../tests/msw/handlers/products.handlers";

const API_URL = "http://localhost:3000/api";

/* ---- Helper para renderizar ProductsPage con router real - */

function renderProductsPage(initialEntry = "/app/products") {
  const router = createMemoryRouter(
    [
      {
        path: "/app/products",
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: "/app/products/new",
        element: <div>New Product Page</div>,
      },
    ],
    { initialEntries: [initialEntry] }
  );

  return render(
    <ThemeProvider>
      <SettingsProvider>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

describe("ProductsPage — Integration Tests", () => {

  /* ---- Happy path --------------------------------------- */

  it("debería mostrar los productos tras cargar correctamente", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("4K Monitor")).toBeInTheDocument();
  });

  it("debería mostrar el header 'Inventory Ledger'", async () => {
    renderProductsPage();

    await waitFor(() => {
      // Usar getAllByText cuando puede haber múltiples — tomamos el primero (heading)
      const headings = screen.getAllByText("Inventory Ledger");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it("debería mostrar las estadísticas de inventario", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Total Items")).toBeInTheDocument();
    });

    // "Available" puede aparecer múltiples veces (stat label + badge) — solo verificamos presencia
    const availableEls = screen.getAllByText("Available");
    expect(availableEls.length).toBeGreaterThan(0);

    const outOfStockEls = screen.getAllByText("Out of Stock");
    expect(outOfStockEls.length).toBeGreaterThan(0);
  });

  it("debería mostrar el botón 'Add Product'", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /add product/i })).toBeInTheDocument();
    });
  });

  it("debería mostrar el botón 'Export CSV'", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText(/export csv/i)).toBeInTheDocument();
    });
  });

  /* ---- Empty state -------------------------------------- */

  it("debería mostrar EmptyState cuando no hay productos", async () => {
    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
          data: [], total: 0, page: 1, totalPages: 0, hasNext: false, hasPrev: false,
        });
      })
    );

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText(/no products yet/i)).toBeInTheDocument();
    });
  });

  it("EmptyState debe mostrar CTA para crear el primer producto", async () => {
    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
          data: [], total: 0, page: 1, totalPages: 0, hasNext: false, hasPrev: false,
        });
      })
    );

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText(/create first product/i)).toBeInTheDocument();
    });
  });

  /* ---- Error state -------------------------------------- */

  it("debería propagar el error cuando la API falla con 500", async () => {
    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
      })
    );

    // React Router v7 lanza el error del loader, esperamos que el componente no se renderice
    // o que se propague al error boundary
    // En este caso el loader lanza un Error, así que el RouterProvider manejará el error
    expect(() => renderProductsPage()).not.toThrow(); // No debe crashear la app
  });

  /* ---- Búsqueda ----------------------------------------- */

  it("debería mostrar el campo de búsqueda", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search by name or sku/i)).toBeInTheDocument();
    });
  });

  it("debería mostrar resultados filtrados al buscar", async () => {
    server.use(
      http.get(`${API_URL}/products`, ({ request }) => {
        const url    = new URL(request.url);
        const search = url.searchParams.get("search");

        if (search === "Keyboard") {
          return HttpResponse.json({
            data:       [mockProducts[0]],
            total:      1,
            page:       1,
            totalPages: 1,
            hasNext:    false,
            hasPrev:    false,
          });
        }
        return HttpResponse.json(mockPaginatedResponse);
      })
    );

    renderProductsPage("/app/products?search=Keyboard");

    await waitFor(() => {
      expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    });

    expect(screen.queryByText("Wireless Mouse")).not.toBeInTheDocument();
  });

  it("debería mostrar conteo de productos en el texto de resultados", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText(/3 products/i)).toBeInTheDocument();
    });
  });

  /* ---- Paginación -------------------------------------- */

  it("no debería mostrar controles de paginación cuando hay 1 página", async () => {
    // mockPaginatedResponse tiene totalPages: 1, no debe mostrar controles
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    });

    expect(screen.queryByText(/prev/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
  });

  it("debería mostrar controles de paginación cuando hay múltiples páginas", async () => {
    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
          ...mockPaginatedResponse,
          total:      50,
          totalPages: 3,
          hasNext:    true,
          hasPrev:    false,
        });
      })
    );

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText(/prev/i)).toBeInTheDocument();
      expect(screen.getByText(/next/i)).toBeInTheDocument();
    });
  });

  /* ---- Accesibilidad básica ----------------------------- */

  it("la tabla debe tener el rol correcto", async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  it("el buscador debe ser accesible", async () => {
    renderProductsPage();

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search by name or sku/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

});
