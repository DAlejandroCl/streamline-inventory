/* ============================================================
   SWAGGER CONFIGURATION
   Define el spec OpenAPI 3.0 base. Los endpoints se documentan
   con JSDoc directamente en product.routes.ts para mantener
   la documentación cerca del código que describe.
   ============================================================ */

import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Streamline Inventory API",
      version: "1.0.0",
      description: "Production-ready REST API for product administration",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Laptop Pro 16" },
            price: { type: "number", example: 1499 },
            availability: { type: "boolean", example: true },
            createdAt: { type: "string", example: "2026-04-20T10:00:00.000Z" },
            updatedAt: { type: "string", example: "2026-04-20T10:00:00.000Z" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string", example: "Laptop Pro 16" },
            price: { type: "number", example: 1499 },
          },
        },
        ProductPatchInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Laptop Pro 16" },
            price: { type: "number", example: 1499 },
            availability: { type: "boolean", example: false },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Product not found" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(options);
