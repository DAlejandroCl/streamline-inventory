/* ============================================================
   RENDER WITH PROVIDERS
   Usa createMemoryRouter (data router) para que los hooks de
   React Router 7 (useSubmit, useActionData, useNavigation,
   useLoaderData, Form) funcionen correctamente en tests.

   Uso básico:
     renderWithProviders(<MyComponent />)

   Con ruta específica:
     renderWithProviders(<MyComponent />, { route: "/app/products" })

   Con rutas adicionales (para navegación):
     renderWithProviders(<MyComponent />, {
       route: "/app/products/new",
       extraRoutes: [{ path: "/app/products", element: <div /> }]
     })
   ============================================================ */

import React from "react";
import { render, type RenderResult } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { SettingsProvider } from "../../context/SettingsContext";
import { ThemeProvider } from "../../context/ThemeContext";
import { NotificationsProvider } from "../../context/NotificationsContext";

type ExtraRoute = {
  path: string;
  element: React.ReactElement;
};

type RenderOptions = {
  route?: string;
  extraRoutes?: ExtraRoute[];
};

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderOptions = {}
): RenderResult {
  const { route = "/", extraRoutes = [] } = options;

  const router = createMemoryRouter(
    [
      { path: route, element: ui },
      ...extraRoutes.map((r) => ({ path: r.path, element: r.element })),
      // catch-all para evitar warnings de rutas no definidas
      { path: "*", element: <div data-testid="not-found" /> },
    ],
    { initialEntries: [route] }
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

/* ---- Re-export RTL utilities for convenience -------------- */
export { screen, waitFor, within, act } from "@testing-library/react";
