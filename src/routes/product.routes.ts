import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProduct,
} from "../controllers/product.controllers.js";

// ROUTER SETUP
const router = Router();

// ROUTES
router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;
