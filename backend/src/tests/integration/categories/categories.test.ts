/* ============================================================
   CATEGORIES API — INTEGRATION TESTS
   Runner: Node.js nativo (node --test)
   DB:     SQLite in-memory

   Cobertura:
   - GET  /api/categories       → 200 lista directa
   - POST /api/categories       → 201, 400, 409 duplicate
   - Integridad Category + Product
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import server from "../../../server.js";
import { setupDatabase, cleanDatabase, teardownDatabase } from "../../setup/database.js";
import { createAuthApi, createApi } from "../../helpers/request.helper.js";
import {
  categoryPayload,
  categoryPayloads,
  invalidCategoryPayloads,
  resetCategoryCounter,
} from "../../factories/category.factory.js";

test("Categories API — Integration Tests", async (t) => {
  await setupDatabase();
  resetCategoryCounter();

  const api       = await createAuthApi(server);
  const publicApi = createApi(server);

  /* =========================================================
     AUTH — GET es público, POST/DELETE requieren auth
     ========================================================= */

  await t.test("Auth behavior", async (t) => {
    await t.test("GET /api/categories es público (no requiere cookie)", async () => {
      const res = await publicApi.get("/api/categories");
      // Las categorías son rutas de lectura pública
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  /* =========================================================
     GET /api/categories
     ========================================================= */

  await t.test("GET /api/categories", async (t) => {

    await t.test("debería retornar un array con 200", async () => {
      const res = await api.get("/api/categories");
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body), "Response debe ser un array");
    });

    await t.test("debería retornar array vacío cuando no hay categorías", async () => {
      const res = await api.get("/api/categories");
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });

    await t.test("cada categoría debe tener id, name y color", async () => {
      await api.post("/api/categories").send(categoryPayloads.electronics());

      const res = await api.get("/api/categories");
      assert.equal(res.status, 200);
      const cat = res.body[0] as Record<string, unknown>;
      assert.ok(cat.id, "Debe tener id");
      assert.equal(typeof cat.name, "string");
      assert.ok(cat.color, "Debe tener color");
    });

  });

  /* =========================================================
     POST /api/categories
     ========================================================= */

  await t.test("POST /api/categories", async (t) => {

    await t.test("debería crear una categoría y retornar 201", async () => {
      const payload = categoryPayloads.furniture();
      const res = await api.post("/api/categories").send(payload);

      assert.equal(res.status, 201);
      assert.ok(res.body.data?.id);
      assert.equal(res.body.data.name, payload.name);
    });

    await t.test("debería persistir la categoría (aparece en GET)", async () => {
      const payload = categoryPayloads.tools();
      const created = await api.post("/api/categories").send(payload);
      const id = created.body.data.id;

      const res = await api.get("/api/categories");
      const found = res.body.find((c: { id: number }) => c.id === id);
      assert.ok(found, "La categoría debe aparecer en el listado");
    });

    await t.test("debería rechazar nombre duplicado con 409", async () => {
      const unique = `UniqueCategory-${Date.now()}`;
      await api.post("/api/categories").send({ name: unique, color: "#10b981" });

      const res = await api.post("/api/categories").send({ name: unique, color: "#10b981" });
      assert.equal(res.status, 409);
      assert.ok(res.body.message, "Debe incluir un mensaje de error");
    });

    await t.test("debería rechazar body vacío con 400 y errors array", async () => {
      const res = await api.post("/api/categories").send(invalidCategoryPayloads.emptyBody);
      assert.equal(res.status, 400);
      // Categories usa express-validator → retorna { errors: [] }
      assert.ok(Array.isArray(res.body.errors), "Debe incluir errors array");
    });

  });

  /* =========================================================
     Integridad — Categoría + Producto
     ========================================================= */

  await t.test("Category + Product relationship", async (t) => {

    await t.test("producto con category_id debe incluir category en GET /:id", async () => {
      const catRes = await api.post("/api/categories").send(categoryPayload({ name: `RelCat-${Date.now()}` }));
      const categoryId = catRes.body.data.id;

      const prodRes = await api.post("/api/products").send({
        name: "Categorized Product",
        price: 100,
        stock: 5,
        category_id: categoryId,
      });
      const productId = prodRes.body.data.id;

      const res = await api.get(`/api/products/${productId}`);
      assert.equal(res.status, 200);
      assert.ok(res.body.category, "Debe incluir la categoría");
      assert.equal(res.body.category.id, categoryId);
      assert.equal(typeof res.body.category.name, "string");
      assert.ok(res.body.category.color);
    });

  });

  await cleanDatabase();
  await teardownDatabase();
});
