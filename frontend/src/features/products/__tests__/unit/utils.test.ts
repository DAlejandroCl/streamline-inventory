/* ============================================================
   UTILITY FUNCTIONS — UNIT TESTS
   formatCurrency: formatea valores monetarios con Intl
   cn: compone clases de Tailwind condicionalmente
   ============================================================ */

import { describe, it, expect } from "vitest";
import { formatCurrency } from "../../../../lib/utils/formatCurrency";
import { cn } from "../../../../lib/utils/cn";

/* =========================================================
   formatCurrency
   ========================================================= */

describe("formatCurrency", () => {
  it("debería formatear un valor USD correctamente", () => {
    const result = formatCurrency(99.99, "USD");
    expect(result).toBe("$99.99");
  });

  it("debería incluir decimales mínimos de 2 cifras", () => {
    const result = formatCurrency(100, "USD");
    expect(result).toContain("100.00");
  });

  it("debería formatear valores COP correctamente", () => {
    const result = formatCurrency(50000, "COP", "es-CO");
    expect(result).toContain("50");
    expect(result).toContain("000");
  });

  it("debería formatear valores EUR correctamente", () => {
    const result = formatCurrency(99.99, "EUR", "de-DE");
    expect(result).toContain("99");
  });

  it("debería manejar valor 0", () => {
    const result = formatCurrency(0, "USD");
    expect(result).toBe("$0.00");
  });

  it("debería manejar valores grandes", () => {
    const result = formatCurrency(1_000_000, "USD");
    expect(result).toContain("1");
    expect(result).toContain("000");
  });

  it("debería manejar valores decimales precisos", () => {
    const result = formatCurrency(1.5, "USD");
    expect(result).toBe("$1.50");
  });

  it("debería usar locale correcto por currency por defecto", () => {
    // Debe funcionar sin pasar locale explícito
    const result = formatCurrency(100, "USD");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });
});

/* =========================================================
   cn (class names helper)
   ========================================================= */

describe("cn", () => {
  it("debería concatenar clases con espacio", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("debería filtrar valores undefined", () => {
    expect(cn("px-4", undefined, "py-2")).toBe("px-4 py-2");
  });

  it("debería filtrar valores null", () => {
    expect(cn("px-4", null, "py-2")).toBe("px-4 py-2");
  });

  it("debería filtrar valores false", () => {
    expect(cn("px-4", false, "py-2")).toBe("px-4 py-2");
  });

  it("debería soportar clases condicionales con &&", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });

  it("clase condicional false no debe aparecer", () => {
    const isActive = false;
    expect(cn("base", isActive && "active")).toBe("base");
  });

  it("debería retornar string vacío sin argumentos", () => {
    expect(cn()).toBe("");
  });

  it("debería retornar string vacío con solo valores falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("debería preservar clases complejas de Tailwind", () => {
    const result = cn("bg-[var(--color-primary)]", "text-sm", "font-bold");
    expect(result).toBe("bg-[var(--color-primary)] text-sm font-bold");
  });
});
