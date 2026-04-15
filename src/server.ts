import express from "express";
import router from "./routes/product.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SERVER CONFIG
const server = express();

// MIDDLEWARES
server.use(express.json());

// SERVE STATIC FILES (logo)
server.use("/public", express.static(path.join(__dirname, "public")));

// SWAGGER CUSTOM CSS
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar {
      background-color: #0f172a;
    }

    .swagger-ui .topbar-wrapper img {
      content: url('/public/logo.png');
      width: 220px;
      height: auto;
    }
  `,
  customSiteTitle: "Streamline Inventory API"
};

// ROUTES
server.use("/api/products", router);

// SWAGGER DOCS
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

// ROOT ROUTE
server.get("/", (req, res) => {
  res.json({
    message: "API is running",
    docs: "http://localhost:3000/docs"
  });
});

// EXPORT
export default server;