import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "API documentation for Products management"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
      }
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "price"],
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "Laptop"
            },
            price: {
              type: "number",
              example: 1500
            },
            availability: {
              type: "boolean",
              example: true
            },
            createdAt: {
              type: "string",
              example: "2026-04-13T21:45:28.840Z"
            },
            updatedAt: {
              type: "string",
              example: "2026-04-13T21:45:28.840Z"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;