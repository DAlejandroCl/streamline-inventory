/* ============================================================
   UPDATE PRODUCT ACTION — UNIT TESTS
   Testa updateProductAction directamente con fetch mockeado.
   Mismo patrón que product.action.test.ts pero para PATCH.
   ============================================================ */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateProductAction } from "../../../../actions/updateProduct.action";

function makeRequest(fields: Record<string, string>, id = "1"): { request: Request; params: { id: string }; context: object } {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return {
    request: new Request(`http://localhost/app/products/${id}/edit`, {
      method: "POST",
      body: formData,
    }),
    params: { id },
    context: {},
  };
}

const validFields = {
  name:         "Updated Keyboard",
  price:        "150",
  stock:        "20",
  availability: "on",
};

type ActionErrors = {
  errors: Record<string, string[]>;
  values: Record<string, unknown>;
};

describe("updateProductAction — Unit Tests", () => {

  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  /* ---- Validación Zod ----------------------------------- */

  it("retorna errors.name cuando name queda vacío tras trim()", async () => {
    const args = makeRequest({ ...validFields, name: " " });
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.name[0]).toBe("Product name is required");
  });

  it("retorna errors.price cuando price es 0", async () => {
    const args = makeRequest({ ...validFields, price: "0" });
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.price[0]).toBe("Price must be greater than 0");
  });

  it("retorna values con los datos del form tras error Zod", async () => {
    const args = makeRequest({ ...validFields, name: " " });
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { values } = result as ActionErrors;
    expect(values.price).toBe(150);
    expect(values.stock).toBe(20);
  });

  /* ---- Backend errors ---------------------------------- */

  it("retorna errors.general cuando el PATCH responde 404", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Product not found");
  });

  it("retorna errors.general cuando el PATCH responde 500", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Database error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Database error");
  });

  it("usa 'Error updating product.' cuando el body no tiene message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Error updating product.");
  });

  it("retorna 'Network error. Please try again.' cuando fetch lanza", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Network error. Please try again.");
  });

  it("retorna values con los datos del form tras error de red", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).not.toBeInstanceOf(Response);
    const { values } = result as ActionErrors;
    expect(values.name).toBe("Updated Keyboard");
  });

  /* ---- Éxito ------------------------------------------- */

  it("retorna redirect a /app/products en caso de éxito", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "ok", data: { id: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const args = makeRequest(validFields);
    const result = await updateProductAction(args);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(302);
    expect((result as Response).headers.get("Location")).toBe("/app/products");
  });

  it("envía el PATCH a la URL correcta con el ID del producto", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: 5 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const args = makeRequest(validFields, "5");
    await updateProductAction(args);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/products/5"),
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("lanza cuando no se provee ID de producto", async () => {
    const formData = new FormData();
    Object.entries(validFields).forEach(([k, v]) => formData.append(k, v));
    const badArgs = {
      request: new Request("http://localhost/app/products/edit", { method: "POST", body: formData }),
      params: {},  // sin id
      context: {},
    };

    await expect(
      updateProductAction(badArgs as Parameters<typeof updateProductAction>[0])
    ).rejects.toBeDefined();
  });

});
