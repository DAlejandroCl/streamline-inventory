import request from "supertest";
import server from "../server.js";

// TEST SUITE
describe("Product API", () => {

  // CREATE PRODUCT
  it("should create a product", async () => {
    const res = await request(server)
      .post("/api/products")
      .send({
        name: "Test Product",
        price: 100
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Product");
  });

  // GET ALL
  it("should get all products", async () => {
    const res = await request(server).get("/api/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET BY ID
  it("should get product by id", async () => {
    const res = await request(server).get("/api/products/1");

    expect([200, 404]).toContain(res.status);
  });

});