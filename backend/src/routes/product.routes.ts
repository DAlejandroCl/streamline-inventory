/* ============================================================
   PRODUCT ROUTES
   Todas las rutas mutantes tienen validación explícita.
   Las reglas de validación se definen una sola vez y se
   reutilizan donde corresponde (nameRule, priceRule).

   PUT: validación completa (name + price obligatorios).
   PATCH: validación opcional (solo los campos enviados).
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

const router = Router();

/* ---- Reglas de validación reutilizables ------------------- */

const nameRule = body("name")
  .notEmpty()
  .withMessage("Product name is required");

const priceRule = body("price")
  .notEmpty()
  .withMessage("Price is required")
  .isFloat({ gt: 0 })
  .withMessage("Price must be greater than 0");

/* ---- READ -------------------------------------------------- */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", [nameRule, priceRule], validate, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Replace a product (full update)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put("/:id", [nameRule, priceRule], validate, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Partially update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPatchInput'
 *     responses:
 *       200:
 *         description: Product patched
 *       404:
 *         description: Product not found
 */
router.patch(
  "/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Product name cannot be empty"),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("availability")
      .optional()
      .isBoolean()
      .withMessage("Availability must be a boolean"),
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/:id", deleteProduct);

export default router;
