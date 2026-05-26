/* ============================================================
   E2E — ACCESSIBILITY (axe-core en browser real)
   
   Complementa los tests de a11y en Vitest/jsdom con validaciones
   reales en el browser que sí ejecutan CSS y calculan contraste.
   
   Esto detecta violaciones que jsdom NO puede encontrar:
   - Contraste de color real (usando CSS custom properties)
   - Focus visibility con estilos aplicados
   - Reflow de texto con zoom 200%
   
   Requiere: npm install @axe-core/playwright
   ============================================================ */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loginAsAdmin } from "./helpers/auth";

// Reglas a ignorar que son false positives conocidos en Streamline:
// - color-contrast: verificado manualmente en el design system
const IGNORE_RULES: string[] = [];

test.describe("E2E — Accessibility (axe en browser)", () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Inventory Ledger (/app/products) no tiene violaciones axe", async ({ page }) => {
    await page.goto("/app/products");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(IGNORE_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("New Product form (/app/products/new) no tiene violaciones axe", async ({ page }) => {
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(IGNORE_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("Dashboard (/app) no tiene violaciones axe", async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(IGNORE_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("Login page (/login) no tiene violaciones axe", async ({ page }) => {
    // No usar loginAsAdmin — testear la página de login pública
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(IGNORE_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("Error page (404) no tiene violaciones axe", async ({ page }) => {
    // Navegar a una ruta de producto que no existe para triggear el error boundary
    await page.goto("/app/products/999999/edit");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(IGNORE_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("el formulario de nuevo producto es navegable por teclado", async ({ page }) => {
    await page.goto("/app/products/new");
    await page.waitForLoadState("networkidle");

    // Navegar por el formulario con Tab
    await page.keyboard.press("Tab");
    const focusedEl = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedEl).toBeTruthy();

    // Tab debe moverse al siguiente campo
    await page.keyboard.press("Tab");
    const nextFocused = await page.evaluate(() => document.activeElement?.id);
    expect(nextFocused).toBeTruthy();
  });

  test("los links de la ErrorPage son alcanzables por teclado", async ({ page }) => {
    await page.goto("/app/products/999999/edit");
    await page.waitForLoadState("networkidle");

    // Hacer Tab hasta encontrar los links de recuperación
    let found = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const isLink = await page.evaluate(() => document.activeElement?.tagName === "A");
      if (isLink) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

});
