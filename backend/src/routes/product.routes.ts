/* ============================================================
   PRODUCT ROUTES
   All routes are protected — requireAuth validates the
   httpOnly cookie before any controller executes.

   Validation rules are defined once and reused across
   POST and PUT (full replace) endpoints.
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
import { validate } from "../middlewares/validation.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

/* All product routes require authentication */
router.use(requireAuth);

/* ---- Reusable validation rules --------------------------- */

const nameRule = body("name").notEmpty().withMessage("Product name is required");
const priceRule = body("price")
  .notEmpty().withMessage("Price is required")
  .isFloat({ gt: 0 }).withMessage("Price must be greater than 0");
const stockRule = body("stock")
  .notEmpty().withMessage("Stock is required")
  .isInt({ min: 0 }).withMessage("Stock must be 0 or greater");

/* ---- READ ------------------------------------------------ */

router.get("/", getProducts);
router.get("/:id", getProductById);

/* ---- WRITE ----------------------------------------------- */

router.post("/", [nameRule, priceRule, stockRule], validate, createProduct);
router.put("/:id", [nameRule, priceRule, stockRule], validate, updateProduct);
router.patch(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be > 0"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),
    body("availability").optional().isBoolean().withMessage("Must be boolean"),
    body("category_id").optional().isInt({ gt: 0 }).withMessage("Invalid category ID"),
  ],
  validate,
  patchProduct
);
router.delete("/:id", deleteProduct);

export default router;
