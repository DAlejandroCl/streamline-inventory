/* ============================================================
   PRODUCT CONTROLLERS
   Handlers HTTP delgados. Delegan toda lógica al service.
   Express 5: promesas rechazadas se propagan automáticamente
   al errorHandler — no se necesitan bloques try-catch.

   createProduct / updateProduct: Multer procesa el archivo
   antes de que el handler se ejecute. Si se subió una imagen,
   req.file existe y construimos el path relativo para guardar.
   ============================================================ */

import { Request, Response } from "express";
import * as ProductService from "../services/product.service.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

/* ---- GET ALL ---------------------------------------------- */

export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const products = await ProductService.getAllProducts();
  res.json(products);
};

/* ---- GET BY ID -------------------------------------------- */

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await ProductService.getProductById(Number(req.params.id));
  res.json(product);
};

/* ---- CREATE ----------------------------------------------- */

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as CreateProductDTO;

  /*
   * Multer deposita el archivo en /public/uploads/products/
   * Guardamos el path relativo para que el frontend pueda
   * construir la URL: BASE_URL + image_url
   */
  if (req.file) {
    body.image_url = `/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.createProduct(body);
  res.status(201).json({ data: product });
};

/* ---- UPDATE (PUT — reemplazo completo) -------------------- */

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as UpdateProductDTO;

  if (req.file) {
    body.image_url = `/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.updateProduct(
    Number(req.params.id),
    body
  );
  res.json({ message: "Product updated", data: product });
};

/* ---- PATCH (actualización parcial) ------------------------ */

export const patchProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as UpdateProductDTO;

  if (req.file) {
    body.image_url = `/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.updateProduct(
    Number(req.params.id),
    body
  );
  res.json({ message: "Product patched", data: product });
};

/* ---- DELETE ----------------------------------------------- */

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  await ProductService.deleteProduct(Number(req.params.id));
  res.json({ message: "Product deleted" });
};
