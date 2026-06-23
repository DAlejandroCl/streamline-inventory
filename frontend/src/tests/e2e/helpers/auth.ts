/* ============================================================
   E2E AUTH HELPER
   Centraliza el flujo de login para los tests de Playwright.
   
   Uso:
     import { loginAsAdmin } from "./helpers/auth";
     test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
   
   O usar el fixture de storage state para reutilizar la sesión:
     await loginAsAdmin(page);
     await page.context().storageState({ path: "e2e/.auth/admin.json" });
   ============================================================ */

import type { Page } from "@playwright/test";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@streamline.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export async function loginAsAdmin(page: Page): Promise<void> {
  // Si ya hay sesión activa (storageState global), ir directo a /app
  await page.goto("/app");
  if (page.url().includes("/app") && !page.url().includes("/login")) {
    return; // sesión válida del storageState
  }

  // Sin sesión → hacer login UI
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in|login|log in|enter/i }).click();
  await page.waitForURL("**/app**", { timeout: 10_000 });
}

export async function logout(page: Page): Promise<void> {
  // El logout está en el Sidebar como form con action="/app/logout"
  // Buscamos el botón de logout o el link
  const logoutBtn = page.getByRole("button", { name: /logout|sign out/i });
  if (await logoutBtn.isVisible()) {
    await logoutBtn.click();
  } else {
    // Fallback: navegar directamente
    await page.goto("/login");
  }
  await page.waitForURL("**/login**", { timeout: 5_000 });
}
