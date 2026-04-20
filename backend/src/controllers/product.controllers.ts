/* ============================================================
   PRODUCT CONTROLLERS
   Thin HTTP handlers. Each controller delegates all business
   logic to the product service and never interacts with the
   Sequelize model directly.

   Express 5 native async error handling: rejected promises
   propagate automatically to the global error handler, so
   no try-catch blocks are needed here.
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
  const product = await ProductService.createProduct(req.body as CreateProductDTO);
  res.status(201).json({ data: product });
};

/* ---- UPDATE (full replace) -------------------------------- */

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await ProductService.updateProduct(
    Number(req.params.id),
    req.body as UpdateProductDTO
  );
  res.json({ message: "Product updated", data: product });
};

/* ---- PATCH (partial update) ------------------------------- */

export const patchProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await ProductService.updateProduct(
    Number(req.params.id),
    req.body as UpdateProductDTO
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