/* ============================================================
   PRODUCT ROUTES
   Validation is applied to every mutating route.
   The validate middleware short-circuits invalid requests
   before they reach the controller layer.
   ============================================================ */

import { Router } from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import { validate } from "../middlewares/validation.js";

const router = Router();

/* ---- Shared validation rules ------------------------------ */

const nameRule = body("name")
  .notEmpty()
  .withMessage("Product name is required");

const priceRule = body("price")
  .notEmpty()
  .withMessage("Price is required")
  .isFloat({ gt: 0 })
  .withMessage("Price must be greater than 0");

/* ---- Routes ----------------------------------------------- */

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", [nameRule, priceRule], validate, createProduct);

router.put("/:id", [nameRule, priceRule], validate, updateProduct);

router.patch(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Product name cannot be empty"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("availability").optional().isBoolean().withMessage("Availability must be a boolean"),
  ],
  validate,
  patchProduct
);

router.delete("/:id", deleteProduct);

export default router;