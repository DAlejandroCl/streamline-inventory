import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProduct
} from "../controllers/product.controllers.js";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProducts);

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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product completely
 *     tags: [Products]
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product partially
 *     tags: [Products]
 */
router.patch("/:id", patchProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 */
router.delete("/:id", deleteProduct);

export default router;