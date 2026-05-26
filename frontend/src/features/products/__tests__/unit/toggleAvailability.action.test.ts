/* ============================================================
   TOGGLE AVAILABILITY ACTION — UNIT TESTS
   toggleAvailabilityAction: recibe id, name, availability actual.
   Llama a toggleAvailability(id, currentAvailability) del API client.
   Redirige al Referer o a /app/products.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleAvailabilityAction } from "../../../../actions/toggleAvailability.action";

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

import { toggleAvailability } from "../../../../lib/api/products";

function makeToggleRequest(
  fields: Record<string, string>,
  referer?: string
): Request {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  const headers: Record<string, string> = {};
  if (referer) headers["Referer"] = referer;
  return new Request("http://localhost/app/products/toggle", {
    method: "POST", body: fd, headers,
  });
}

describe("toggleAvailabilityAction — Unit Tests", () => {

  beforeEach(() => { vi.clearAllMocks(); });

  /* ---- Éxito ------------------------------------------- */

  it("retorna redirect tras toggle exitoso", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);

    const result = await toggleAvailabilityAction({
      request: makeToggleRequest({
        id: "1", name: "Mechanical Keyboard", availability: "true",
      }),
      params: {},
      context: {},
    });

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(302);
  });

  it("redirige al Referer cuando está presente", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);
    const referer = "http://localhost/app/products";

    const result = await toggleAvailabilityAction({
      request: makeToggleRequest({ id: "1", availability: "true" }, referer),
      params: {},
      context: {},
    });

    expect((result as Response).headers.get("Location")).toBe(referer);
  });

  it("redirige a /app/products cuando no hay Referer", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);

    const result = await toggleAvailabilityAction({
      request: makeToggleRequest({ id: "1", availability: "false" }),
      params: {},
      context: {},
    });

    expect((result as Response).headers.get("Location")).toBe("/app/products");
  });

  it("llama a toggleAvailability con id y el valor actual (true)", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);

    await toggleAvailabilityAction({
      request: makeToggleRequest({ id: "5", availability: "true" }),
      params: {},
      context: {},
    });

    // Pasa el valor ACTUAL (true) al service para que lo invierta en el backend
    expect(toggleAvailability).toHaveBeenCalledWith("5", true);
  });

  it("llama a toggleAvailability con availability=false cuando era false", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);

    await toggleAvailabilityAction({
      request: makeToggleRequest({ id: "3", availability: "false" }),
      params: {},
      context: {},
    });

    expect(toggleAvailability).toHaveBeenCalledWith("3", false);
  });

  /* ---- Errores ----------------------------------------- */

  it("lanza Response 500 cuando toggleAvailability falla", async () => {
    vi.mocked(toggleAvailability).mockRejectedValueOnce(new Error("API error"));

    await expect(
      toggleAvailabilityAction({
        request: makeToggleRequest({ id: "1", availability: "true" }),
        params: {},
        context: {},
      })
    ).rejects.toBeInstanceOf(Response);
  });

  it("lanza Response cuando no se provee ID", async () => {
    await expect(
      toggleAvailabilityAction({
        request: makeToggleRequest({ availability: "true" }), // sin id
        params: {},
        context: {},
      })
    ).rejects.toBeInstanceOf(Response);
  });

  it("llama a toggleAvailability exactamente una vez", async () => {
    vi.mocked(toggleAvailability).mockResolvedValueOnce(undefined);

    await toggleAvailabilityAction({
      request: makeToggleRequest({ id: "2", name: "Mouse", availability: "true" }),
      params: {},
      context: {},
    });

    expect(toggleAvailability).toHaveBeenCalledTimes(1);
  });

});
