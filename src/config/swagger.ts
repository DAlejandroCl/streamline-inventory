import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "Advanced API documentation for Products"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "price"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Laptop" },
            price: { type: "number", example: 1500 },
            availability: { type: "boolean", example: true },
            createdAt: { type: "string", example: "2026-04-13T21:45:28.840Z" },
            updatedAt: { type: "string", example: "2026-04-13T21:45:28.840Z" }
          }
        },

        ProductInput: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string", example: "Laptop" },
            price: { type: "number", example: 1500 }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error message" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export default swaggerJSDoc(options);