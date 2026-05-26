/* ============================================================
   DELETE PRODUCT ACTION — UNIT TESTS
   deleteProductAction: recibe FormData con `id` y `name`,
   llama a deleteProduct(id) del API client, redirige tras éxito.
   ============================================================ */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteProductAction } from "../../../../actions/deleteProduct.action";

/* ---- Mock del API client (deleteProduct usa fetch interno) */
vi.mock("../../../../lib/api/products", () => ({
  deleteProduct:       vi.fn(),
  toggleAvailability:  vi.fn(),
  getProducts:         vi.fn(),
  getAllProducts:       vi.fn(),
  getProductById:      vi.fn(),
  getCategories:       vi.fn(),
  createProduct:       vi.fn(),
  updateProduct:       vi.fn(),
}));

import { deleteProduct } from "../../../../lib/api/products";

function makeDeleteRequest(fields: Record<string, string>): Request {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return new Request("http://localhost/app/products/delete", {
    method: "POST", body: fd,
  });
}

describe("deleteProductAction — Unit Tests", () => {

  beforeEach(() => { vi.clearAllMocks(); });

  /* ---- Éxito ------------------------------------------- */

  it("retorna redirect a /app/products tras delete exitoso", async () => {
    vi.mocked(deleteProduct).mockResolvedValueOnce(undefined);

    const result = await deleteProductAction({
      request: makeDeleteRequest({ id: "1", name: "Mechanical Keyboard" }),
      params: {},
      context: {},
    });

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(302);
    expect((result as Response).headers.get("Location")).toBe("/app/products");
  });

  it("llama a deleteProduct con el ID correcto", async () => {
    vi.mocked(deleteProduct).mockResolvedValueOnce(undefined);

    await deleteProductAction({
      request: makeDeleteRequest({ id: "42" }),
      params: {},
      context: {},
    });

    expect(deleteProduct).toHaveBeenCalledWith("42");
  });

  it("redirige aunque no se pase el nombre del producto", async () => {
    vi.mocked(deleteProduct).mockResolvedValueOnce(undefined);

    const result = await deleteProductAction({
      request: makeDeleteRequest({ id: "7" }), // sin name
      params: {},
      context: {},
    });

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get("Location")).toBe("/app/products");
  });

  /* ---- Errores ----------------------------------------- */

  it("lanza Response 500 cuando deleteProduct falla", async () => {
    vi.mocked(deleteProduct).mockRejectedValueOnce(new Error("Network error"));

    await expect(
      deleteProductAction({
        request: makeDeleteRequest({ id: "1" }),
        params: {},
        context: {},
      })
    ).rejects.toBeInstanceOf(Response);
  });

  it("lanza Response cuando no se provee ID", async () => {
    await expect(
      deleteProductAction({
        request: makeDeleteRequest({}), // sin id
        params: {},
        context: {},
      })
    ).rejects.toBeInstanceOf(Response);
  });

  it("llama a deleteProduct exactamente una vez", async () => {
    vi.mocked(deleteProduct).mockResolvedValueOnce(undefined);

    await deleteProductAction({
      request: makeDeleteRequest({ id: "3", name: "Test" }),
      params: {},
      context: {},
    });

    expect(deleteProduct).toHaveBeenCalledTimes(1);
  });

});
