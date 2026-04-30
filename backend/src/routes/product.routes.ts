/* ============================================================
   PRODUCT ROUTES
   upload.single("image") ahora devuelve un array de dos
   middlewares: [multer, processImage (sharp)].
   El spread ...upload.single("image") los aplica en secuencia.
   ============================================================ */

import { Router } from "express";
import {
  getProducts,
  getAllUnpaginated,
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
router.get("/all", getAllUnpaginated);
router.get("/:id", getProductById);

/* ---- WRITE — Multer + Sharp antes del handler ------------- */
router.post(  "/",    ...upload.single("image"), createProduct);
router.put(   "/:id", ...upload.single("image"), updateProduct);
router.patch( "/:id", ...upload.single("image"), patchProduct);
router.delete("/:id", deleteProduct);

export default router;
