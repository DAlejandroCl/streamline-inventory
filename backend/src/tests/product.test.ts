/* ============================================================
   PRODUCT API INTEGRATION TESTS
   Uses the native Node.js test runner with supertest.
   The in-memory SQLite database is reset before each test
   suite via the setup/cleanup/teardown helpers.
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import server from "../server.js";
import { setup, cleanup, teardown } from "./setup.js";

test("Product API", async (t) => {
  await setup();

  /* ---- CREATE -------------------------------------------- */

  await t.test("POST /api/products — should create a product", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({ name: "Laptop", price: 1500 });

    assert.equal(res.status, 201);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.name, "Laptop");
  });

  /* ---- VALIDATION ---------------------------------------- */

  await t.test("POST /api/products — should reject missing fields", async () => {
    const res = await request(server).post("/api/products").send({});
    assert.equal(res.status, 400);
    assert.ok(res.body.errors);
  });

  /* ---- GET ALL ------------------------------------------- */

  await t.test("GET /api/products — should return all products", async () => {
    await request(server).post("/api/products").send({ name: "Phone", price: 800 });
    const res = await request(server).get("/api/products");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  /* ---- GET BY ID ----------------------------------------- */

  await t.test("GET /api/products/:id — should return a product by id", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Tablet", price: 600 });

    const id = created.body?.data?.id;
    assert.ok(id, "Created product must have an id");

    const res = await request(server).get(`/api/products/${id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, id);
  });

  /* ---- GET BY ID — NOT FOUND ----------------------------- */

  await t.test("GET /api/products/:id — should return 404 for unknown id", async () => {
    const res = await request(server).get("/api/products/999999");
    assert.equal(res.status, 404);
  });

  /* ---- UPDATE -------------------------------------------- */

  await t.test("PUT /api/products/:id — should update a product", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "TV", price: 1200 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .put(`/api/products/${id}`)
      .send({ name: "Smart TV", price: 1400 });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, "Smart TV");
  });

  /* ---- PATCH --------------------------------------------- */

  await t.test("PATCH /api/products/:id — should patch availability", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Monitor", price: 300 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server)
      .patch(`/api/products/${id}`)
      .send({ availability: false });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.availability, false);
  });

  /* ---- DELETE -------------------------------------------- */

  await t.test("DELETE /api/products/:id — should delete a product", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Keyboard", price: 100 });

    const id = created.body?.data?.id;
    assert.ok(id);

    const res = await request(server).delete(`/api/products/${id}`);
    assert.equal(res.status, 200);

    const check = await request(server).get(`/api/products/${id}`);
    assert.equal(check.status, 404);
  });

  await cleanup();
  await teardown();
});