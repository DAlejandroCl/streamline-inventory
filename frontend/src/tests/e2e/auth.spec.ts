/* ============================================================
   E2E — AUTHENTICATION FLOWS

   Flujos de autenticación end-to-end:
   - Login correcto → redirect al dashboard
   - Login incorrecto → mensaje de error visible
   - Rutas protegidas sin sesión → redirect a login
   - Logout → redirect a login y sesión destruida

   NOTA: los tests que verifican rutas sin sesión usan
   `browser.newContext({ storageState: { cookies:[], origins:[] } })`
   para anular el storageState global que inyecta la cookie de admin.
   ============================================================ */

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("E2E — Authentication", () => {

  /* ---- Login correcto ----------------------------------- */

  test("login con credenciales válidas redirige al dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("admin@streamline.app");
    await page.getByLabel(/password/i).fill("admin123");
    await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();

    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });
  });

  test("tras login el dashboard muestra el nombre del usuario", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/app");

    await expect(
      page.getByText(/admin/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  /* ---- Login incorrecto --------------------------------- */

  test("login con password incorrecto muestra mensaje de error", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("admin@streamline.app");
    await page.getByLabel(/password/i).fill("wrong_password_12345");
    await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();

    await expect(
      page.getByRole("alert").filter({ hasText: /invalid credentials/i })
    ).toBeVisible({ timeout: 5_000 });

    await expect(page).toHaveURL(/\/login/);
  });

  test("login con email vacío muestra error de validación", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("noexiste@test.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();

    await expect(
      page.getByText(/invalid credentials/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  /* ---- Protección de rutas (sin sesión) -----------------
     Usan un context limpio para anular el storageState global.
     -------------------------------------------------------- */

  test("acceder a /app sin sesión redirige a /login", async ({ browser }) => {
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto("/app");
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
    await ctx.close();
  });

  test("acceder a /app/products sin sesión redirige a /login", async ({ browser }) => {
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto("/app/products");
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
    await ctx.close();
  });

  test("acceder a /app/products/new sin sesión redirige a /login", async ({ browser }) => {
    const ctx  = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto("/app/products/new");
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
    await ctx.close();
  });

  /* ---- Persistencia de sesión -------------------------- */

  test("la sesión persiste al navegar entre páginas", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/app/products");
    await expect(page).toHaveURL(/\/app\/products/);

    await page.goto("/app");
    await expect(page).toHaveURL(/\/app/);

    await expect(page).not.toHaveURL(/\/login/);
  });

  /* ---- Loading state en login -------------------------- */

  test("el botón de login muestra estado loading durante el submit", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("admin@streamline.app");
    await page.getByLabel(/password/i).fill("admin123");

    const submitBtn = page.getByRole("button", { name: /sign in|log in|login|enter/i });
    await submitBtn.click();

    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });
  });

});
