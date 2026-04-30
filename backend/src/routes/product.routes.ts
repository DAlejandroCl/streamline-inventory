/* ============================================================
   PRODUCT ROUTES
   Todas las rutas protegidas por requireAuth.
   Multer procesa multipart/form-data en rutas de escritura.

   express-validator se omite en rutas con Multer porque lee
   req.body antes de que Multer lo popule. La validación se
   hace en parseMultipartBody (controller) y validateProductData
   (service).
   ============================================================ */

import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload }      from "../config/multer.js";

const router = Router();

router.use(requireAuth);

/* ---- READ -------------------------------------------------- */
router.get("/",    getProducts);
router.get("/:id", getProductById);

/* ---- WRITE — Multer antes del handler ---------------------- */
router.post(  "/",    upload.single("image"), createProduct);
router.put(   "/:id", upload.single("image"), updateProduct);
router.patch( "/:id", upload.single("image"), patchProduct);
router.delete("/:id", deleteProduct);

export default router;
