import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import server from "../server.js";
import { setup, cleanup, teardown } from "./setup.js";

test("Product API", async (t) => {

  await setup();

  // CREATE
  await t.test("should create a product", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({
        name: "Laptop",
        price: 1500
      });

    console.log("CREATE RESPONSE:", res.body); // 👈 DEBUG

    assert.strictEqual(res.status, 201);
  });

  // VALIDATION
  await t.test("should fail validation", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({});

    assert.strictEqual(res.status, 400);
  });

  // GET ALL
  await t.test("should get all products", async () => {
    await request(server)
      .post("/api/products")
      .send({ name: "Phone", price: 800 });

    const res = await request(server).get("/api/products");

    console.log("GET ALL:", res.body); // 👈 DEBUG

    assert.strictEqual(res.status, 200);
  });

  // GET BY ID
  await t.test("should get product by id", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Tablet", price: 600 });

    console.log("CREATED:", created.body); // 👈 DEBUG

    const id = created.body?.data?.id;

    assert.ok(id);

    const res = await request(server)
      .get(`/api/products/${id}`);

    assert.strictEqual(res.status, 200);
  });

  // UPDATE
  await t.test("should update product", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "TV", price: 1200 });

    const id = created.body?.data?.id;

    assert.ok(id);

    const res = await request(server)
      .put(`/api/products/${id}`)
      .send({ name: "Smart TV", price: 1400 });

    assert.strictEqual(res.status, 200);
  });

  // DELETE
  await t.test("should delete product", async () => {
    const created = await request(server)
      .post("/api/products")
      .send({ name: "Keyboard", price: 100 });

    const id = created.body?.data?.id;

    assert.ok(id);

    const res = await request(server)
      .delete(`/api/products/${id}`);

    assert.strictEqual(res.status, 200);
  });

  await cleanup();
  await teardown();
});