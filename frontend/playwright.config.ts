import { defineConfig, devices } from "@playwright/test";

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

  // Autentica una vez antes de todos los tests vía UI y persiste la cookie.
  globalSetup: "./src/tests/e2e/global-setup",

  use: {
    baseURL:           BASE_URL,
    trace:             "on",
    screenshot:        "only-on-failure",
    video:             "retain-on-failure",
    actionTimeout:     10_000,
    navigationTimeout: 15_000,
    // Cada browser context nace con la cookie de admin ya cargada.
    storageState:      "./src/tests/e2e/.auth/admin.json",
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
