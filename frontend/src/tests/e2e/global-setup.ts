/* ============================================================
   PLAYWRIGHT GLOBAL SETUP — Auth via API
   Autentica una vez usando APIRequestContext (no UI),
   guarda el storageState (cookie httpOnly) en .auth/admin.json.
   
   Cada test project carga ese archivo como storageState → el
   browser context ya tiene la cookie → no necesita hacer login
   en beforeEach vía UI.

   Esto también aísla el crash del backend durante los tests:
   si el backend crashea entre tests, el cookie del storageState
   sigue válido cuando el backend se recupera (JWT stateless).
   ============================================================ */

import { chromium, type FullConfig } from "@playwright/test";
import path from "node:path";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@streamline.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const API_URL        = process.env.VITE_API_URL   ?? "http://localhost:3000";
const FRONTEND_URL   = process.env.FRONTEND_URL   ?? "http://localhost:4173";

export const AUTH_FILE = path.join(import.meta.dirname, ".auth/admin.json");

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: FRONTEND_URL });
  const page    = await context.newPage();

  // POST al backend directamente (no via UI) — más rápido y robusto.
  // El backend pone la cookie httpOnly en la response.
  // Playwright la almacena en el context.
  // Autenticar vía UI para que la cookie httpOnly quede correctamente
  // en el cookiejar del browser context y se serialice en el storageState.
  // APIRequestContext no propaga cookies httpOnly al storageState del browser.
   await page.goto("/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();
  // Usar patrón glob en lugar de URL absoluta — React Router puede redirigir
  // a /app/products u otra subruta tras login exitoso.
  await page.waitForURL("**/app**", { timeout: 15_000 });
  // Cookie httpOnly ya está en el cookiejar del browser context → serializar.
  await context.storageState({ path: AUTH_FILE });

  await browser.close();
}
