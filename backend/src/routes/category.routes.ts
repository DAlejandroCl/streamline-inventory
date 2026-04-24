/* ============================================================
   CATEGORY ROUTES
   ============================================================ */

import { Router } from "express";
import { body } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import { validate } from "../middlewares/validation.js";

const router = Router();

const nameRule = body("name").notEmpty().withMessage("Category name is required");
const colorRule = body("color")
  .optional()
  .matches(/^#[0-9A-Fa-f]{6}$/)
  .withMessage("Color must be a valid hex code (e.g. #6366f1)");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 */
router.post("/", [nameRule, colorRule], validate, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 */
router.patch(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    colorRule,
  ],
  validate,
  updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 */
router.delete("/:id", deleteCategory);

export default router;
