/* ============================================================
   SMOKE TESTS — Post-Deploy Validation

   NOTA: el storageState global inyecta la cookie de admin en
   todos los contexts. Los tests que verifican comportamiento
   SIN sesión usan browser.newContext({ storageState: { cookies:[], origins:[] } })
   para crear un context limpio explícitamente.
   ============================================================ */

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("Smoke Tests — Post-Deploy", () => {

  test("la landing page carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Streamline/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("la página de login es accesible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("el login con credenciales válidas funciona", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/app/);
  });

  test("el dashboard carga con datos después del login", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("la página de inventario es accesible tras autenticación", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app/products");
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

  // Context limpio sin cookies: anula el storageState global de admin.
  test("rutas protegidas redirigen a login sin sesión", async ({ browser }) => {
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto("/app/products");
    await expect(page).toHaveURL(/\/login/);
    await ctx.close();
  });

  test("ruta no existente va a la landing (catch-all)", async ({ page }) => {
    await page.goto("/esta-ruta-no-existe");
    await expect(page).toHaveURL(/\/$/);
  });

});
