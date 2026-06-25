/* ============================================================
   PLAYWRIGHT GLOBAL SETUP — Auth via browser UI
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
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: FRONTEND_URL });
  const page    = await context.newPage();

  // Loggear response del login para diagnosticar Set-Cookie
  page.on("response", async (res) => {
    if (res.url().includes("/api/auth/login")) {
      console.log("[global-setup] Login response status:", res.status());
      const headers = res.headers();
      console.log("[global-setup] Set-Cookie:", headers["set-cookie"] ?? "NONE");
    }
  });

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in|login|enter/i }).click();
  await page.waitForURL("**/app**", { timeout: 15_000 });

  // Verificar que la cookie existe antes de serializar
  const cookies = await context.cookies();
  const tokenCookie = cookies.find(c => c.name === "token");
  console.log("[global-setup] Token cookie:", tokenCookie
    ? `domain=${tokenCookie.domain}, sameSite=${tokenCookie.sameSite}, httpOnly=${tokenCookie.httpOnly}`
    : "NOT FOUND ❌"
  );

  await context.storageState({ path: AUTH_FILE });
  console.log("[global-setup] StorageState saved. Cookies count:", cookies.length);

  await browser.close();
}
