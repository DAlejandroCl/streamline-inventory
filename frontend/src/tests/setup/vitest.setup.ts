/* ============================================================
   VITEST GLOBAL SETUP
   Configura el entorno de testing para todos los archivos:
   - @testing-library/jest-dom → matchers .toBeInTheDocument(), etc.
   - MSW server lifecycle → intercepta fetch en todos los tests
   - cleanup() → desmonta componentes React después de cada test
   ============================================================ */

import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "../msw/server";

/* ---- Mocks de browser APIs ausentes en jsdom -------------- */

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/* MSW lifecycle */
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
