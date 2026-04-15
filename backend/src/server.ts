import express from "express";
import cors from "cors";
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

// CORS CONFIG
server.use(cors({
  origin: "http://localhost:5173",
}));

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

    .swagger-ui .topbar-wrapper {
      display: flex;
      align-items: center;
    }

    .swagger-ui .topbar-wrapper img,
    .swagger-ui .topbar-wrapper svg {
      display: none !important;
    }

    .swagger-ui .topbar-wrapper::before {
      content: '';
      display: block;
      width: 220px;
      height: 60px;
      background-image: url('/public/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left center;
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