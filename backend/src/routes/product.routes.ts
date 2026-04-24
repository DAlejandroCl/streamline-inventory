/* ============================================================
   PRODUCT ROUTES
   Todas las rutas mutantes tienen validación explícita.
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

/* ---- Validation rules ------------------------------------- */

const nameRule = body("name").notEmpty().withMessage("Product name is required");
const priceRule = body("price")
  .notEmpty().withMessage("Price is required")
  .isFloat({ gt: 0 }).withMessage("Price must be greater than 0");
const stockRule = body("stock")
  .notEmpty().withMessage("Stock is required")
  .isInt({ min: 0 }).withMessage("Stock must be 0 or greater");

/* ---- READ -------------------------------------------------- */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (includes category)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/* ---- WRITE ------------------------------------------------- */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
router.post("/", [nameRule, priceRule, stockRule], validate, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Full replace of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/:id", [nameRule, priceRule, stockRule], validate, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Partial update of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.patch(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be 0 or greater"),
    body("availability").optional().isBoolean().withMessage("Availability must be boolean"),
    body("category_id").optional().isInt({ gt: 0 }).withMessage("Invalid category ID"),
  ],
  validate,
  patchProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 */
router.delete("/:id", deleteProduct);

export default router;
