/* ============================================================
   VITEST GLOBAL SETUP
   Configura el entorno de testing para todos los archivos:
   - @testing-library/jest-dom → matchers .toBeInTheDocument(), etc.
   - MSW server lifecycle → intercepta fetch en todos los tests
   - cleanup() → desmonta componentes React después de cada test
   ============================================================ */

import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "../msw/server";
import { run as axeRun } from "axe-core";
import type { Result } from "axe-core";

/* ---- Accessibility matcher (toHaveNoViolations) -----------
   vitest-axe@0.1.0 no es compatible con vitest v3.
   Implementación propia con axe-core directamente.

   axe.run es un singleton global. Para evitar "Axe is already running"
   cuando varios its corren en paralelo dentro del mismo describe.sequential,
   serializamos las llamadas con una Promise queue a nivel de módulo.
   fileParallelism: false en vitest.config.ts previene colisiones entre archivos.
   ----------------------------------------------------------- */
let _axeQueue: Promise<void> = Promise.resolve();

expect.extend({
  async toHaveNoViolations(element: Element | Document | HTMLElement) {
    const context =
      element instanceof Element || element instanceof Document
        ? element
        : document.body;

    let violations: Result[] = [];

    // Encolar la llamada para garantizar que solo una axeRun corre a la vez.
    _axeQueue = _axeQueue.then(async () => {
      const results = await axeRun(context, {
        rules: { "color-contrast": { enabled: false } },
      });
      violations = results.violations;
    });

    await _axeQueue;

    if (violations.length === 0) {
      return { pass: true, message: () => "No axe violations found" };
    }

    const details = violations
      .map(
        (v: Result) =>
          `[${v.impact}] ${v.id}: ${v.description}\n  ` +
          v.nodes.map((n) => n.html).join("\n  "),
      )
      .join("\n\n");

    return {
      pass: false,
      message: () =>
        `Expected no axe violations but found ${violations.length}:\n\n${details}`,
    };
  },
});

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<T = any, R = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    toHaveNoViolations(): R;
  }
}

/* ---- Mocks de browser APIs ausentes en jsdom -------------- */

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches:  false,
    media:    query,
    onchange: null,
    addListener:         () => {},
    removeListener:      () => {},
    addEventListener:    () => {},
    removeEventListener: () => {},
    dispatchEvent:       () => false,
  }),
});

global.ResizeObserver = class ResizeObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
};

/* ---- MSW lifecycle --------------------------------------- */
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
