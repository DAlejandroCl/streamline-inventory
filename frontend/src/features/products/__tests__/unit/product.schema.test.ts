/* ============================================================
   PRODUCT SCHEMA — UNIT TESTS
   Valida el schema Zod que define los contratos del formulario.
   Estos tests aseguran que las reglas de validación del frontend
   son consistentes con las del backend.
   ============================================================ */

import { describe, it, expect } from "vitest";
import { ProductSchema } from "../../../../schemas/product.schema";

const validProduct = {
  name:  "Mechanical Keyboard",
  price: 120.00,
  stock: 15,
};

describe("ProductSchema — Validación Zod", () => {

  /* ---- Happy path ---------------------------------------- */

  it("debería validar un producto con campos mínimos requeridos", () => {
    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("debería validar un producto con todos los campos opcionales", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      sku:          "KB-001",
      description:  "A great keyboard",
      category_id:  1,
      cost:         60.00,
      availability: true,
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar availability false", () => {
    const result = ProductSchema.safeParse({ ...validProduct, availability: false });
    expect(result.success).toBe(true);
  });

  it("debería aceptar stock = 0", () => {
    const result = ProductSchema.safeParse({ ...validProduct, stock: 0 });
    expect(result.success).toBe(true);
  });

  it("debería aceptar category_id null", () => {
    const result = ProductSchema.safeParse({ ...validProduct, category_id: null });
    expect(result.success).toBe(true);
  });

  /* ---- Name validation ---------------------------------- */

  it("debería rechazar name vacío", () => {
    const result = ProductSchema.safeParse({ ...validProduct, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  /* ---- Price validation --------------------------------- */

  it("debería rechazar price = 0", () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toBeDefined();
    }
  });

  it("debería rechazar price negativo", () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: -10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toBeDefined();
    }
  });

  it("debería aceptar price con decimales", () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: 99.99 });
    expect(result.success).toBe(true);
  });

  /* ---- Stock validation --------------------------------- */

  it("debería rechazar stock negativo", () => {
    const result = ProductSchema.safeParse({ ...validProduct, stock: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.stock).toBeDefined();
    }
  });

  it("debería rechazar stock decimal", () => {
    const result = ProductSchema.safeParse({ ...validProduct, stock: 5.5 });
    expect(result.success).toBe(false);
  });

  /* ---- SKU validation ----------------------------------- */

  it("debería rechazar SKU mayor a 50 caracteres", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      sku: "A".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar SKU de exactamente 50 caracteres", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      sku: "A".repeat(50),
    });
    expect(result.success).toBe(true);
  });

  /* ---- Description validation --------------------------- */

  it("debería rechazar description mayor a 1000 caracteres", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      description: "A".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  /* ---- Cost validation ---------------------------------- */

  it("debería rechazar cost negativo", () => {
    const result = ProductSchema.safeParse({ ...validProduct, cost: -1 });
    expect(result.success).toBe(false);
  });

  it("debería aceptar cost = 0", () => {
    const result = ProductSchema.safeParse({ ...validProduct, cost: 0 });
    expect(result.success).toBe(true);
  });

  /* ---- Missing required fields -------------------------- */

  it("debería retornar errores para múltiples campos inválidos", () => {
    const result = ProductSchema.safeParse({ name: "", price: -1, stock: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    }
  });
});
