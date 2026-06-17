import { defineConfig, devices } from "@playwright/test";
import { AUTH_FILE } from "./src/tests/e2e/global-setup";

const BASE_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries:    process.env.CI ? 2 : 0,
  workers:    1,
  reporter:   [
    ["html", { open: "never" }],
    ["list"],
  ],

  // Autenticar una vez antes de todos los tests; el cookie se guarda en AUTH_FILE.
  globalSetup: "./src/tests/e2e/global-setup",

  use: {
    baseURL:           BASE_URL,
    trace:             "on",
    screenshot:        "only-on-failure",
    video:             "retain-on-failure",
    actionTimeout:     10_000,
    navigationTimeout: 15_000,
    // Cargar el storageState pre-autenticado en cada browser context.
    storageState:      AUTH_FILE,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    ...(process.env.CI ? [] : [
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
    ]),
  ],
});
