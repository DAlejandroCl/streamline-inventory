import { Router } from "express";
import { body } from "express-validator";

// CONTROLLERS
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
} from "../controllers/product.controllers.js";

// MIDDLEWARES
import { validate } from "../middlewares/validation.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0")
  ],
  validate,
  createProduct
);

router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;