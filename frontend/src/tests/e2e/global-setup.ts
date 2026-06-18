/* ============================================================
   PLAYWRIGHT GLOBAL SETUP — Auth via browser UI
   Autentica una vez navegando por el UI (no APIRequestContext),
   para que la cookie httpOnly quede correctamente en el
   cookiejar del browser context y se serialice en storageState.
   ============================================================ */
import { chromium, type FullConfig } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@streamline.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const FRONTEND_URL   = process.env.FRONTEND_URL   ?? "http://localhost:4173";

export const AUTH_FILE = path.join(
  import.meta.dirname,
  ".auth/admin.json"
);

export default async function globalSetup(_config: FullConfig): Promise<void> {
  // Asegurar que el directorio .auth exista
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: FRONTEND_URL });
  const page    = await context.newPage();

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();

  // Esperar redirect post-login — React Router puede ir a /app o /app/products
  await page.waitForURL("**/app**", { timeout: 15_000 });

  // Cookie httpOnly ya está en el cookiejar → serializar correctamente
  await context.storageState({ path: AUTH_FILE });

  await browser.close();

  console.log("[global-setup] Auth state saved to", AUTH_FILE);
}
