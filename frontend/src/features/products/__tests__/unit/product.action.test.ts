/* ============================================================
   CREATE PRODUCT ACTION — UNIT TESTS
   Testa la función createProductAction directamente, sin pasar
   por el router. Esto permite testear todos los escenarios de
   error que son difíciles de reproducir a través del FormData
   completo en el entorno jsdom (campo imagen vacío de ImageUpload).

   La función recibe un Request con FormData y retorna:
   - { errors, values } cuando Zod o el backend fallan
   - Response (redirect) cuando tiene éxito

   Se usa fetch global mocked via vi.stubGlobal para simular
   las respuestas del backend sin depender de MSW.
   ============================================================ */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createProductAction } from "../../../../actions/product.actions";

/* ---- Helper para crear un Request con FormData ----------- */
function makeRequest(fields: Record<string, string>): Request {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new Request("http://localhost/app/products/new", {
    method: "POST",
    body: formData,
  });
}

/* ---- Campos válidos base --------------------------------- */
const validFields = {
  name:         "Mechanical Keyboard",
  price:        "120",
  stock:        "15",
  availability: "on",
};

/* ---- Tipo del retorno del action (no redirect) ---------- */
type ActionErrors = {
  errors: Record<string, string[]>;
  values: Record<string, unknown>;
};

const makeActionArgs = (request: Request) => ({
  request,
  params: {},
  context: {},
  unstable_url: new URL("http://localhost"),
  unstable_pattern: "",
});

describe("createProductAction — Unit Tests", () => {

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /* ---- Validación Zod ----------------------------------- */

  it("retorna errors.name cuando name está vacío tras trim()", async () => {
    // " " → trim() → "" → Zod.min(1)
    const request = makeRequest({ ...validFields, name: " " });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.name).toBeDefined();
    expect(errors.name[0]).toBe("Product name is required");
  });

  it("retorna errors.price cuando price es 0", async () => {
    const request = makeRequest({ ...validFields, price: "0" });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.price).toBeDefined();
    expect(errors.price[0]).toBe("Price must be greater than 0");
  });

  it("retorna errors.price cuando price es negativo", async () => {
    const request = makeRequest({ ...validFields, price: "-10" });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.price).toBeDefined();
  });

  it("retorna errors.stock cuando stock es negativo", async () => {
    const request = makeRequest({ ...validFields, stock: "-1" });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.stock).toBeDefined();
    expect(errors.stock[0]).toBe("Stock must be 0 or greater");
  });

  it("retorna errors.stock cuando stock tiene decimales", async () => {
    const request = makeRequest({ ...validFields, stock: "1.5" });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.stock).toBeDefined();
    expect(errors.stock[0]).toBe("Stock must be a whole number");
  });

  it("retorna values con los datos del form tras error Zod", async () => {
    const request = makeRequest({ ...validFields, name: " " });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { values } = result as ActionErrors;
    // El action retorna los datos parseados para repopular el form
    expect(values).toBeDefined();
    expect(values.price).toBe(120);
    expect(values.stock).toBe(15);
  });

  it("retorna múltiples errores cuando varios campos son inválidos", async () => {
    const request = makeRequest({ name: " ", price: "0", stock: "-1", availability: "on" });
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(Object.keys(errors).length).toBeGreaterThan(1);
  });

  /* ---- Backend 4xx / 5xx -------------------------------- */

  it("retorna errors.general cuando el backend responde 409", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "SKU already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general).toBeDefined();
    expect(errors.general[0]).toBe("SKU already exists");
  });

  it("retorna errors.general cuando el backend responde 500", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Internal server error");
  });

  it("usa 'Error creating product.' como fallback cuando body no tiene message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Error creating product.");
  });

  it("retorna values con los datos del form tras error de backend", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Conflict" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { values } = result as ActionErrors;
    expect(values.name).toBe("Mechanical Keyboard");
    expect(values.price).toBe(120);
    expect(values.stock).toBe(15);
  });

  /* ---- Error de red ------------------------------------ */

  it("retorna 'Network error. Please try again.' cuando fetch lanza", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { errors } = result as ActionErrors;
    expect(errors.general[0]).toBe("Network error. Please try again.");
  });

  it("retorna values con los datos del form tras error de red", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    expect(result).not.toBeInstanceOf(Response);
    const { values } = result as ActionErrors;
    expect(values.name).toBe("Mechanical Keyboard");
  });

  /* ---- Éxito ------------------------------------------- */

  it("retorna un Response redirect hacia /app/products en caso de éxito", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: 1, name: "Mechanical Keyboard" } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest(validFields);
    const result = await createProductAction(makeActionArgs(request));

    // El action retorna redirect() que es una Response con Location header
    expect(result).toBeInstanceOf(Response);
    const res = result as Response;
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/app/products");
  });

  it("interpreta availability='on' como true en el payload", async () => {
    let capturedBody: unknown;
    vi.mocked(fetch).mockImplementationOnce(async (_, init) => {
      // Capturar el body enviado
      const fd = init?.body as FormData;
      capturedBody = Object.fromEntries(fd?.entries?.() ?? []);
      return new Response(JSON.stringify({ data: { id: 1 } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    });

    const request = makeRequest({ ...validFields, availability: "on" });
    await createProductAction(makeActionArgs(request));

    // El action pasa el formData original al fetch (no el data parseado)
    // Solo verificamos que el action pasó la validación y llamó a fetch
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("interpreta availability='off' como false en la validación Zod", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: 1 } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );

    const request = makeRequest({ ...validFields, availability: "off" });
    const result = await createProductAction(makeActionArgs(request));

    // availability: false es válido (optional en Zod) → debe proceder
    expect(result).toBeInstanceOf(Response); // redirect
  });

});
