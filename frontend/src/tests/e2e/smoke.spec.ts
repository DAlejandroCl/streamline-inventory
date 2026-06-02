/* ============================================================
   SMOKE TESTS — Post-Deploy Validation
   
   Objetivo: verificar que la aplicación está viva y los flujos
   más críticos funcionan tras cada deploy.
   
   Estos tests deben:
   - Ser rápidos (< 30s total)
   - Verificar conectividad básica
   - Validar que la autenticación funciona
   - Confirmar que las rutas principales cargan
   
   Se ejecutan en CI después de cada deploy a producción.
   ============================================================ */

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("Smoke Tests — Post-Deploy", () => {

  test("la landing page carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Streamline/i);
    // La página debe renderizar algo visible
    await expect(page.locator("body")).toBeVisible();
  });

  test("la página de login es accesible", async ({ page }) => {
    await page.goto("/login");
    // El formulario de login debe estar presente
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("el login con credenciales válidas funciona", async ({ page }) => {
    await loginAsAdmin(page);
    // Tras login, debemos estar en /app (dashboard)
    await expect(page).toHaveURL(/\/app/);
  });

  test("el dashboard carga con datos después del login", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app");
    // El dashboard debe renderizar alguna métrica
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("la página de inventario es accesible tras autenticación", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app/products");
    // En CI la DB está vacía — renderiza EmptyState con "No products yet"
    // En producción con datos — renderiza la tabla
    await expect(
      page.locator("table, h2").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("el formulario de nuevo producto carga correctamente", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app/products/new");
    await expect(
      page.getByPlaceholder(/wireless keyboard/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("rutas protegidas redirigen a login sin sesión", async ({ page }) => {
    // Sin login, /app debe redirigir a /login
    await page.goto("/app/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("ruta no existente va a la landing (catch-all)", async ({ page }) => {
    await page.goto("/esta-ruta-no-existe");
    // El catch-all redirige a /
    // toHaveURL compara la URL completa — usamos sufijo "/" para ser agnóstico al host
    await expect(page).toHaveURL(/\/$/);
  });

});
