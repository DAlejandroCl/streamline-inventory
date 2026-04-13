import express from "express";
import router from "./routes/product.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// SERVER CONFIG
const server = express();

// MIDDLEWARES
server.use(express.json());

// ROUTES
server.use("/api/products", router);

// SWAGGER DOCS
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROOT ROUTE
server.get("/", (req, res) => {
  res.json({
    message: "API is running",
    docs: "http://localhost:3000/docs"
  });
});

// EXPORT
export default server;