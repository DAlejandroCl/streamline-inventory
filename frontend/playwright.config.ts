/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

/**
 * Streamline — Playwright E2E Configuration
 *
 * Requisitos antes de ejecutar:
 *   1. Backend corriendo en http://localhost:3000
 *   2. Frontend corriendo en http://localhost:5173 (o FRONTEND_URL)
 *   3. Base de datos con el admin seed: admin@streamline.app / admin123
 *
 * Comandos:
 *   npx playwright test              → todos los flujos
 *   npx playwright test --ui         → modo interactivo
 *   npx playwright test --headed     → ver el browser
 *   npx playwright test smoke.spec.ts → solo smoke tests
 *   npx playwright show-report       → ver el reporte HTML
 */

const BASE_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,        // secuencial: los tests comparten estado de DB
  forbidOnly: !!process.env.CI,
  retries:    process.env.CI ? 2 : 0,
  workers:    1,               // 1 worker: evita conflictos en la DB de test
  reporter:   [
    ["html", { open: "never" }],
    ["list"],
  ],

  use: {
    baseURL:           BASE_URL,
    trace:             "on-first-retry",
    screenshot:        "only-on-failure",
    video:             "retain-on-failure",
    actionTimeout:     10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  /* Levantar frontend automáticamente si no está corriendo */
  // webServer: {
  //   command: "npm run dev",
  //   url: BASE_URL,
  //   reuseExistingServer: true,
  //   timeout: 30_000,
  // },
});
