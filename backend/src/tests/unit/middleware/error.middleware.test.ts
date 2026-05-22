/* ============================================================
   ERROR HANDLING — MIDDLEWARE TESTS
   Valida el comportamiento del errorHandler global mediante
   llamadas HTTP reales. No mockea el middleware — lo prueba
   a través de rutas existentes que generan errores conocidos.
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import server from "../../../server.js";
import { setupDatabase, teardownDatabase } from "../../setup/database.js";
import { createAuthApi, createApi } from "../../helpers/request.helper.js";

test("Error Handling — Middleware Tests", async (t) => {
  await setupDatabase();

  const api       = await createAuthApi(server);
  const publicApi = createApi(server);

  /* ---- 404 desde AppError --------------------------------- */

  await t.test("GET /api/products/999999 debe retornar 404 con message", async () => {
    const res = await api.get("/api/products/999999");
    assert.equal(res.status, 404);
    assert.equal(typeof res.body.message, "string");
    assert.ok(res.body.message.length > 0);
  });

  await t.test("respuesta 404 no debe exponer stack trace", async () => {
    const res = await api.get("/api/products/999999");
    assert.equal(res.body.stack, undefined, "No debe exponer stack trace");
  });

  /* ---- 400 desde AppError --------------------------------- */

  await t.test("POST con body inválido debe retornar 400", async () => {
    const res = await api.post("/api/products").send({ name: "", price: 0, stock: 1 });
    assert.equal(res.status, 400);
    assert.equal(typeof res.body.message, "string");
  });

  await t.test("respuesta 400 no debe exponer stack trace", async () => {
    const res = await api.post("/api/products").send({ name: "", price: 0, stock: 1 });
    assert.equal(res.body.stack, undefined, "No debe exponer stack trace");
  });

  /* ---- 401 sin auth --------------------------------------- */

  await t.test("rutas protegidas sin cookie deben retornar 401", async () => {
    const res = await publicApi.get("/api/products");
    assert.equal(res.status, 401);
    assert.equal(typeof res.body.message, "string");
  });

  /* ---- Content-Type --------------------------------------- */

  await t.test("errores deben retornar Content-Type application/json", async () => {
    const res = await api.get("/api/products/999999");
    assert.ok(
      res.headers["content-type"]?.includes("application/json"),
      "Content-Type debe ser application/json"
    );
  });

  await teardownDatabase();
});
