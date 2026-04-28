/* ============================================================
   PRODUCT ROUTES
   Todas las rutas protegidas por requireAuth.
   Multer se aplica como middleware en las rutas de escritura:
   - upload.single("image"): procesa un archivo del campo "image"
   - Si no se adjunta archivo, req.file queda undefined (OK)
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
import { validate }      from "../middlewares/validation.middleware.js";
import { requireAuth }   from "../middlewares/auth.middleware.js";
import { upload }        from "../config/multer.js";

const router = Router();

router.use(requireAuth);

/* ---- Validation rules ------------------------------------- */

const nameRule  = body("name").notEmpty().withMessage("Product name is required");
const priceRule = body("price")
  .notEmpty().withMessage("Price is required")
  .isFloat({ gt: 0 }).withMessage("Price must be greater than 0");
const stockRule = body("stock")
  .notEmpty().withMessage("Stock is required")
  .isInt({ min: 0 }).withMessage("Stock must be 0 or greater");

/* ---- READ -------------------------------------------------- */

router.get("/",    getProducts);
router.get("/:id", getProductById);

/* ---- WRITE (Multer antes del validate) --------------------- */

router.post(
  "/",
  upload.single("image"),
  [nameRule, priceRule, stockRule],
  validate,
  createProduct
);

router.put(
  "/:id",
  upload.single("image"),
  [nameRule, priceRule, stockRule],
  validate,
  updateProduct
);

router.patch(
  "/:id",
  upload.single("image"),
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
