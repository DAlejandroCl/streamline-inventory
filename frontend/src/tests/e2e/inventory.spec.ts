/* ============================================================
   E2E — INVENTORY CRUD FLOW
   ============================================================ */

import { type Page, test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

function uniqueName(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

async function createProduct(
  page: Page,
  name: string,
  price = "99.99",
  stock = "10",
) {
  await page.goto("/app/products/new");
  await page.waitForLoadState("networkidle");

  // Si el authLoader redirigió a /login, re-autenticar y reintentar
  if (page.url().includes("/login")) {
    await loginAsAdmin(page);
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");
  }

  await page.getByPlaceholder(/wireless keyboard/i).fill(name);
  await page.getByLabel(/sale price/i).fill(price);
  await page.getByLabel(/stock quantity/i).fill(stock);
  await page.getByText("Create product").click();

  // Esperar que el action redirija a /app/products.
  // Sin ancla $ ni lookahead negativo — Playwright los evalúa de forma inconsistente.
  await expect(page).toHaveURL(/\/app\/products$/, { timeout: 15_000 });
}

test.describe("E2E — Inventory CRUD Flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  /* ---- Visualizar inventario ---------------------------- */

  test("navegar al inventario muestra título e inventario", async ({
    page,
  }) => {
    await page.goto("/app/products");
    await expect(page.getByText("Inventory Ledger").first()).toBeVisible();
    await expect(page.locator("table, h2").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("el botón 'Add Product' navega al formulario de creación", async ({
    page,
  }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");
    // Dos instancias del link en la página (header + EmptyState) — usar .first()
    await page.locator('a[href="/app/products/new"]').first().click();
    await expect(page).toHaveURL(/\/app\/products\/new/);
    await expect(page.getByPlaceholder(/wireless keyboard/i)).toBeVisible();
  });

  /* ---- Crear producto ----------------------------------- */

  test("crear un producto con datos válidos redirige al inventario", async ({
    page,
  }) => {
    const name = uniqueName("E2E Create Test");
    await createProduct(page, name, "299.99", "25");
    await expect(page.getByText("Inventory Ledger").first()).toBeVisible();
  });

  test("el producto creado aparece en la tabla del inventario", async ({
    page,
  }) => {
    const name = uniqueName("E2E Visible Test");
    await createProduct(page, name, "49.99", "5");

    await page.getByPlaceholder(/search by name or sku/i).fill(name);
    await page.waitForTimeout(600);
    await expect(page.getByText(name)).toBeVisible({ timeout: 5_000 });
  });

  test("validación Zod bloquea submit con name vacío", async ({ page }) => {
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");

    if (page.url().includes("/login")) {
      await loginAsAdmin(page);
      await page.goto("/app/products/new");
      await page.waitForLoadState("networkidle");
    }

    await page.getByPlaceholder(/wireless keyboard/i).fill(" ");
    await page.getByLabel(/sale price/i).fill("50");
    await page.getByLabel(/stock quantity/i).fill("5");
    await page.getByText("Create product").click();
    await expect(page.getByText(/product name is required/i)).toBeVisible({
      timeout: 5_000,
    });
    await expect(page).toHaveURL(/\/app\/products\/new/);
  });

  /* ---- Editar producto ---------------------------------- */

  test("editar un producto actualiza los datos en el inventario", async ({
    page,
  }) => {
    const name = uniqueName("E2E Edit Test");
    const editName = uniqueName("E2E Edited");

    await createProduct(page, name, "150", "20");

    await page.getByPlaceholder(/search by name or sku/i).fill(name);
    await page.waitForTimeout(600);
    await expect(page.getByText(name)).toBeVisible({ timeout: 5_000 });

    await page.getByRole("link", { name: /edit/i }).first().click();
    await expect(page).toHaveURL(/\/edit/);

    const nameInput = page.getByPlaceholder(/wireless keyboard/i);
    await expect(nameInput).toHaveValue(name);
    await nameInput.clear();
    await nameInput.fill(editName);
    await page.getByText("Save changes").click();
    await expect(page).toHaveURL(/\/app\/products$/, { timeout: 15_000 });

    await page.getByPlaceholder(/search by name or sku/i).fill(editName);
    await page.waitForTimeout(600);
    await expect(page.getByText(editName)).toBeVisible({ timeout: 5_000 });
  });

  /* ---- Toggle availability ------------------------------ */

  test("el toggle de availability cambia el estado del producto", async ({
    page,
  }) => {
    const name = uniqueName("E2E Toggle Test");
    await createProduct(page, name, "50", "5");

    await page.getByPlaceholder(/search by name or sku/i).fill(name);
    await page.waitForTimeout(600);
    await expect(page.getByText(name)).toBeVisible({ timeout: 5_000 });

    await page.getByRole("link", { name: /edit/i }).first().click();
    await expect(page).toHaveURL(/\/edit/);

    await page.getByRole("switch").click();
    await expect(page.getByText("Not available")).toBeVisible();

    await page.getByText("Save changes").click();
    await expect(page).toHaveURL(/\/app\/products$/, { timeout: 15_000 });
  });

  /* ---- Eliminar producto -------------------------------- */

  test("eliminar un producto lo remueve de la tabla", async ({ page }) => {
    const name = uniqueName("E2E Delete Test");
    await createProduct(page, name, "10", "1");

    await page.getByPlaceholder(/search by name or sku/i).fill(name);
    await page.waitForTimeout(600);
    await expect(page.getByText(name)).toBeVisible({ timeout: 5_000 });

    await page
      .getByRole("button", { name: /delete/i })
      .first()
      .click();

    const confirmBtn = page.getByRole("button", {
      name: /confirm|yes|delete/i,
    });
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }

    await page.waitForTimeout(600);
    await expect(page.getByText(name)).not.toBeVisible({ timeout: 5_000 });
  });
});
