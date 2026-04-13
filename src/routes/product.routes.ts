import { Router } from "express";
import { body, param } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProduct
} from "../controllers/product.controllers.js";
import { handleInputErrors } from "../middlewares/validation.js";

// ROUTER SETUP
const router = Router();

// GET ALL
router.get('/', getProducts);

// GET BY ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID must be a number'),
  handleInputErrors,
  getProductById
);

// CREATE
router.post(
  '/',
  body('name')
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number'),

  handleInputErrors,
  createProduct
);

// UPDATE (PUT)
router.put(
  '/:id',
  param('id').isInt().withMessage('ID must be a number'),
  handleInputErrors,
  updateProduct
);

// PATCH
router.patch(
  '/:id',
  param('id').isInt().withMessage('ID must be a number'),
  handleInputErrors,
  patchProduct
);

// DELETE
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID must be a number'),
  handleInputErrors,
  deleteProduct
);

export default router;