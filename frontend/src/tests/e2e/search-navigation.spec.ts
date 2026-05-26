/* ============================================================
   E2E — SEARCH, PAGINATION & NAVIGATION
   
   Flujos de búsqueda y paginación del inventario.
   Requiere productos existentes en la DB.
   ============================================================ */

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("E2E — Search & Navigation", () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  /* ---- Búsqueda ----------------------------------------- */

  test("buscar por nombre filtra los resultados en tiempo real", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/search by name or sku/i);
    await searchInput.fill("Mechanical");

    // Debounce de 400ms + render
    await page.waitForTimeout(600);

    // La URL debe tener el parámetro search
    await expect(page).toHaveURL(/search=Mechanical/);

    // El texto de resultados debe actualizarse
    await expect(
      page.getByText(/matching "Mechanical"/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("limpiar búsqueda con 'Clear search' restaura todos los productos", async ({ page }) => {
    await page.goto("/app/products?search=Mechanical");
    await page.waitForLoadState("networkidle");

    // Debe estar visible el botón de limpiar
    const clearBtn = page.getByText(/clear search/i);
    await expect(clearBtn).toBeVisible({ timeout: 5_000 });

    await clearBtn.click();
    await page.waitForTimeout(600);

    // La URL no debe tener search
    await expect(page).not.toHaveURL(/search=/);

    // El input de búsqueda debe estar vacío
    const searchInput = page.getByPlaceholder(/search by name or sku/i);
    await expect(searchInput).toHaveValue("");
  });

  test("búsqueda sin resultados muestra empty state", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/search by name or sku/i);
    await searchInput.fill("xyznonexistentproduct99999");
    await page.waitForTimeout(600);

    await expect(
      page.getByText(/no products found/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  /* ---- Paginación --------------------------------------- */

  test("los controles de paginación navegan entre páginas", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    // Solo testar paginación si hay más de una página
    const nextBtn = page.getByRole("button", { name: /next/i });
    const hasNextPage = await nextBtn.isVisible().catch(() => false);

    if (!hasNextPage) {
      test.skip();
      return;
    }

    // La URL debe tener page=1 por defecto
    const initialUrl = page.url();

    await nextBtn.click();
    await page.waitForLoadState("networkidle");

    // La URL debe haber cambiado al page=2
    await expect(page).toHaveURL(/page=2/);
    await expect(page.url()).not.toBe(initialUrl);
  });

  test("el botón 'Prev' está deshabilitado en la primera página", async ({ page }) => {
    await page.goto("/app/products?page=1");
    await page.waitForLoadState("networkidle");

    const prevBtn = page.getByRole("button", { name: /prev/i });
    if (await prevBtn.isVisible()) {
      await expect(prevBtn).toBeDisabled();
    }
  });

  /* ---- Navegación entre páginas de la app -------------- */

  test("el link del Dashboard en el Sidebar navega a /app", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    // El Sidebar tiene links de navegación
    const dashboardLink = page.getByRole("link", { name: /dashboard/i }).first();
    await dashboardLink.click();

    await expect(page).toHaveURL(/\/app$|\/app\/$/);
  });

  test("el breadcrumb 'Dashboard' navega al dashboard", async ({ page }) => {
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");

    // El breadcrumb del formulario tiene: Dashboard > Inventory > New Product
    await page.getByRole("link", { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/app$|\/app\//);
  });

  test("el breadcrumb 'Inventory' navega a /app/products", async ({ page }) => {
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /inventory/i }).first().click();
    await expect(page).toHaveURL(/\/app\/products/);
  });

  /* ---- Export CSV --------------------------------------- */

  test("el botón 'Export CSV' dispara la descarga del archivo", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    const exportBtn = page.getByText(/export csv/i);

    if (await exportBtn.isVisible()) {
      // Capturar el evento de descarga
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 5_000 }),
        exportBtn.click(),
      ]);

      expect(download.suggestedFilename()).toMatch(/streamline-inventory.*\.csv/);
    }
  });

});
