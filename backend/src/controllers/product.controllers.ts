/* ============================================================
   PRODUCT CONTROLLERS
   Handlers HTTP delgados. Cada función delega completamente
   al service layer y nunca toca el modelo Sequelize.

   Express 5: las promesas rechazadas se propagan automáticamente
   al global error handler — no se necesitan bloques try-catch.
   Las respuestas de error las maneja error.middleware.ts.
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

/* ---- UPDATE (PUT — reemplazo completo) -------------------- */

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

/* ---- PATCH (actualización parcial) ------------------------ */

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
