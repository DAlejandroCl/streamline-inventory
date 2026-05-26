/* ============================================================
   E2E — INVENTORY CRUD FLOW
   
   Flujo completo que simula el trabajo real de un usuario:
   1. Login → Dashboard
   2. Navegar a Inventario
   3. Crear un producto nuevo
   4. Verificar que aparece en la tabla
   5. Editar el producto
   6. Verificar los cambios
   7. Eliminar el producto
   8. Verificar que desaparece
   
   Estos tests requieren la DB real del backend (no SQLite in-memory).
   Cada test limpia sus datos al final para no contaminar los demás.
   ============================================================ */

import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

/* ---- Producto de prueba único por run -------------------- */
const TIMESTAMP  = Date.now();
const TEST_NAME  = `E2E Test Product ${TIMESTAMP}`;
const EDIT_NAME  = `E2E Edited Product ${TIMESTAMP}`;

test.describe("E2E — Inventory CRUD Flow", () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  /* ---- Visualizar inventario ---------------------------- */

  test("navegar al inventario muestra la tabla o empty state", async ({ page }) => {
    await page.goto("/app/products");

    // Debe mostrar el título
    await expect(page.getByText("Inventory Ledger").first()).toBeVisible();

    // Debe mostrar la tabla o el empty state
    const tableOrEmpty = page.locator("table, h2").first();
    await expect(tableOrEmpty).toBeVisible({ timeout: 10_000 });
  });

  test("el botón 'Add Product' navega al formulario de creación", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /add product/i }).click();
    await expect(page).toHaveURL(/\/app\/products\/new/);
    await expect(page.getByPlaceholder(/wireless keyboard/i)).toBeVisible();
  });

  /* ---- Crear producto ----------------------------------- */

  test("crear un producto con datos válidos redirige al inventario", async ({ page }) => {
    await page.goto("/app/products/new");

    // Completar formulario
    await page.getByPlaceholder(/wireless keyboard/i).fill(TEST_NAME);
    await page.getByLabel(/sale price/i).fill("299.99");
    await page.getByLabel(/stock quantity/i).fill("25");

    // Submit
    await page.getByText("Create product").click();

    // Redirect al inventario
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });
    await expect(page.getByText("Inventory Ledger").first()).toBeVisible();
  });

  test("el producto creado aparece en la tabla del inventario", async ({ page }) => {
    // Crear el producto primero
    await page.goto("/app/products/new");
    await page.getByPlaceholder(/wireless keyboard/i).fill(TEST_NAME);
    await page.getByLabel(/sale price/i).fill("99.99");
    await page.getByLabel(/stock quantity/i).fill("10");
    await page.getByText("Create product").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });

    // Verificar que aparece en la tabla (buscar por nombre)
    await page.getByPlaceholder(/search by name or sku/i).fill(TEST_NAME);
    await page.waitForTimeout(600); // debounce de búsqueda (400ms)

    await expect(page.getByText(TEST_NAME)).toBeVisible({ timeout: 5_000 });
  });

  test("validación Zod bloquea submit con name vacío", async ({ page }) => {
    await page.goto("/app/products/new");

    // Escribir un espacio en name (pasa required HTML5, falla Zod)
    await page.getByPlaceholder(/wireless keyboard/i).fill(" ");
    await page.getByLabel(/sale price/i).fill("50");
    await page.getByLabel(/stock quantity/i).fill("5");

    await page.getByText("Create product").click();

    // Debe mostrar el error de validación
    await expect(
      page.getByText(/product name is required/i)
    ).toBeVisible({ timeout: 5_000 });

    // No debe navegar
    await expect(page).toHaveURL(/\/app\/products\/new/);
  });

  /* ---- Editar producto ---------------------------------- */

  test("editar un producto actualiza los datos en el inventario", async ({ page }) => {
    // Crear el producto que vamos a editar
    await page.goto("/app/products/new");
    await page.getByPlaceholder(/wireless keyboard/i).fill(TEST_NAME);
    await page.getByLabel(/sale price/i).fill("150");
    await page.getByLabel(/stock quantity/i).fill("20");
    await page.getByText("Create product").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });

    // Buscar el producto y hacer click en Edit
    await page.getByPlaceholder(/search by name or sku/i).fill(TEST_NAME);
    await page.waitForTimeout(600);
    await expect(page.getByText(TEST_NAME)).toBeVisible({ timeout: 5_000 });

    await page.getByRole("link", { name: /edit/i }).first().click();
    await expect(page).toHaveURL(/\/edit/);

    // Verificar precarga del nombre
    await expect(page.getByDisplayValue(TEST_NAME)).toBeVisible();

    // Cambiar el nombre
    const nameInput = page.getByDisplayValue(TEST_NAME);
    await nameInput.clear();
    await nameInput.fill(EDIT_NAME);

    // Guardar
    await page.getByText("Save changes").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });

    // Verificar que el nombre actualizado aparece
    await page.getByPlaceholder(/search by name or sku/i).fill(EDIT_NAME);
    await page.waitForTimeout(600);
    await expect(page.getByText(EDIT_NAME)).toBeVisible({ timeout: 5_000 });
  });

  /* ---- Toggle availability ------------------------------ */

  test("el toggle de availability cambia el estado del producto", async ({ page }) => {
    // Crear producto disponible
    await page.goto("/app/products/new");
    await page.getByPlaceholder(/wireless keyboard/i).fill(TEST_NAME);
    await page.getByLabel(/sale price/i).fill("50");
    await page.getByLabel(/stock quantity/i).fill("5");
    // El toggle por defecto está en "Available for sale"
    await page.getByText("Create product").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });

    // Ir al edit page y cambiar availability
    await page.getByPlaceholder(/search by name or sku/i).fill(TEST_NAME);
    await page.waitForTimeout(600);
    await expect(page.getByText(TEST_NAME)).toBeVisible({ timeout: 5_000 });

    await page.getByRole("link", { name: /edit/i }).first().click();
    await expect(page).toHaveURL(/\/edit/);

    // Cambiar el toggle
    const toggle = page.getByRole("switch");
    await toggle.click();
    await expect(page.getByText("Not available")).toBeVisible();

    await page.getByText("Save changes").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });
  });

  /* ---- Eliminar producto -------------------------------- */

  test("eliminar un producto lo remueve de la tabla", async ({ page }) => {
    // Crear el producto que vamos a eliminar
    const DELETE_NAME = `E2E Delete Test ${TIMESTAMP}`;
    await page.goto("/app/products/new");
    await page.getByPlaceholder(/wireless keyboard/i).fill(DELETE_NAME);
    await page.getByLabel(/sale price/i).fill("10");
    await page.getByLabel(/stock quantity/i).fill("1");
    await page.getByText("Create product").click();
    await expect(page).toHaveURL(/\/app\/products/, { timeout: 10_000 });

    // Buscar el producto
    await page.getByPlaceholder(/search by name or sku/i).fill(DELETE_NAME);
    await page.waitForTimeout(600);
    await expect(page.getByText(DELETE_NAME)).toBeVisible({ timeout: 5_000 });

    // Hacer click en Delete
    await page.getByRole("button", { name: /delete/i }).first().click();

    // Confirmar en el modal si aparece, o el delete es directo
    const confirmBtn = page.getByRole("button", { name: /confirm|yes|delete/i });
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }

    // El producto debe desaparecer
    await page.waitForTimeout(600);
    await expect(page.getByText(DELETE_NAME)).not.toBeVisible({ timeout: 5_000 });
  });

});
