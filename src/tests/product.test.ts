import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import server from "../server.js";

// TEST SUITE
test("POST /api/products should create a product", async () => {
  const res = await request(server)
    .post("/api/products")
    .send({
      name: "Test Product",
      price: 100
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.data.name, "Test Product");
});

test("GET /api/products should return products", async () => {
  const res = await request(server).get("/api/products");

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
});