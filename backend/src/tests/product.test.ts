/* ============================================================
   PRODUCT API — INTEGRATION TESTS
   Runner: Node.js nativo (node --test)
   DB: SQLite en memoria (aislada por suite)

   Cobertura:
   - POST   /api/products  → 201 created, 400 validation
   - GET    /api/products  → 200 list
   - GET    /api/products/:id → 200 found, 404 not found
   - PUT    /api/products/:id → 200 updated, 400 validation, 404
   - PATCH  /api/products/:id → 200 patched, 404
   - DELETE /api/products/:id → 200 deleted, 404 after delete
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import server from "../server.js";
import { setup, cleanup, teardown } from "./setup.js";

test("Product API", async (t) => {
  await setup();

  /* ---- POST /api/products --------------------------------- */

  await t.test("should create a product and return 201", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({ name: "Laptop Pro 16", price: 1499 });

    assert.equal(res.status, 201);
    assert.ok(res.body.data.id, "Response must include data.id");
    assert.equal(res.body.data.name, "Laptop Pro 16");
    assert.equal(res.body.data.price, 1499);
    assert.equal(res.body.data.availability, true);
  });

  await t.test("should reject missing name with 400", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({ price: 100 });

    assert.equal(res.status, 400);
    assert.ok(Array.isArray(res.body.errors), "Response must include errors array");
  });

  await t.test("should reject missing price with 400", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({ name: "Monitor" });

    assert.equal(res.status, 400);
    assert.ok(Array.isArray(res.body.errors));
  });

  await t.test("should reject price <= 0 with 400", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({ name: "Monitor", price: -50 });

    assert.equal(res.status, 400);
    assert.ok(Array.isArray(res.body.errors));
  });

  await t.test("should reject empty body with 400", async () => {
    const res = await request(server).post("/api/products").send({});

    assert.equal(res.status, 400);
    assert.ok(Array.isArray(res.body.errors));
  });

  /* ---- GET /api/products ---------------------------------- */

  await t.test("should return all products with 200", async () => {
    await request(server)
      .post("/api/products")
      .send({ name: "Wireless Mouse", price: 49 });

    const res = await request(server).get("/api/products");

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body), "Response must be an array");
    assert.ok(res.body.length >= 1);
  });

  /* ---- GET /api/products/:id ------------------------------ */

  await t.test("should return a product by id with 200", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "USB-C Hub", price: 89 });

    const id = created.body?.data?.id;
    assert.ok(id, "Created product must have an id");

    const res = await request(server).get(`/api/products/${id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.id, id);
    assert.equal(res.body.name, "USB-C Hub");
  });

  await t.test("should return 404 for a non-existent id", async () => {
    const res = await request(server).get("/api/products/999999");

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Product not found");
  });

  /* ---- PUT /api/products/:id ------------------------------ */

  await t.test("should fully update a product and return 200", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "4K Monitor", price: 399 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .put(`/api/products/${id}`)
      .send({ name: "4K Monitor Pro", price: 499 });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, "4K Monitor Pro");
    assert.equal(res.body.data.price, 499);
  });

  await t.test("should reject PUT without required fields with 400", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Keyboard", price: 120 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .put(`/api/products/${id}`)
      .send({ name: "Keyboard" });

    assert.equal(res.status, 400);
  });

  await t.test("should return 404 on PUT for a non-existent product", async () => {
    const res = await request(server)
      .put("/api/products/999999")
      .send({ name: "Ghost", price: 1 });

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Product not found");
  });

  /* ---- PATCH /api/products/:id ---------------------------- */

  await t.test("should patch availability to false and return 200", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Webcam HD", price: 79 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .patch(`/api/products/${id}`)
      .send({ availability: false });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.availability, false);
  });

  await t.test("should patch only the price without touching name", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Headphones", price: 150 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .patch(`/api/products/${id}`)
      .send({ price: 199 });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, "Headphones");
    assert.equal(res.body.data.price, 199);
  });

  await t.test("should return 404 on PATCH for a non-existent product", async () => {
    const res = await request(server)
      .patch("/api/products/999999")
      .send({ availability: false });

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Product not found");
  });

  /* ---- DELETE /api/products/:id --------------------------- */

  await t.test("should delete a product and return 200", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Old Item", price: 10 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server).delete(`/api/products/${id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.message, "Product deleted");
  });

  await t.test("should return 404 when fetching a deleted product", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "To Delete", price: 5 });

    const id = created.body?.data?.id;
    assert.ok(id);

    await request(server).delete(`/api/products/${id}`);

    const res = await request(server).get(`/api/products/${id}`);
    assert.equal(res.status, 404);
  });

  await t.test("should return 404 on DELETE for a non-existent product", async () => {
    const res = await request(server).delete("/api/products/999999");
    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Product not found");
  });

  await cleanup();
  await teardown();
});
