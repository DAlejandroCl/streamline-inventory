/* ============================================================
   PRODUCT CONTROLLERS
   Con multipart/form-data todos los campos llegan como strings.
   parseMultipartBody sanitiza y convierte tipos antes del service.

   image_url se guarda como /public/uploads/products/filename
   para que el frontend pueda construir la URL completa:
   VITE_API_URL + image_url → http://localhost:3000/public/uploads/products/filename
   ============================================================ */

import { Request, Response } from "express";
import * as ProductService from "../services/product.service.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

function parseMultipartBody(body: Record<string, unknown>): UpdateProductDTO {
  const raw = body as Record<string, string | undefined>;

  const rawCategoryId = raw.category_id;
  const category_id =
    rawCategoryId && rawCategoryId !== "" && Number(rawCategoryId) > 0
      ? Number(rawCategoryId)
      : null;

  const rawCost = raw.cost;
  const cost = rawCost && rawCost !== "" ? parseFloat(rawCost) : undefined;

  const rawAvailability = raw.availability;
  const availability = rawAvailability === "on" || rawAvailability === "true";

  return {
    name:        raw.name?.trim() ?? "",
    sku:         raw.sku?.trim() || undefined,
    description: raw.description?.trim() || undefined,
    category_id,
    price:       parseFloat(raw.price ?? "0"),
    cost,
    stock:       parseInt(raw.stock ?? "0", 10),
    availability,
  };
}

/* ---- GET ALL ---------------------------------------------- */

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await ProductService.getAllProducts();
  res.json(products);
};

/* ---- GET BY ID -------------------------------------------- */

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const product = await ProductService.getProductById(Number(req.params.id));
  res.json(product);
};

/* ---- CREATE ----------------------------------------------- */

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const dto: CreateProductDTO = parseMultipartBody(req.body as Record<string, unknown>);

  if (req.file) {
    dto.image_url = `/public/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.createProduct(dto);
  res.status(201).json({ data: product });
};

/* ---- UPDATE ----------------------------------------------- */

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const dto: UpdateProductDTO = parseMultipartBody(req.body as Record<string, unknown>);

  if (req.file) {
    dto.image_url = `/public/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.updateProduct(Number(req.params.id), dto);
  res.json({ message: "Product updated", data: product });
};

/* ---- PATCH ------------------------------------------------ */

export const patchProduct = async (req: Request, res: Response): Promise<void> => {
  const dto: UpdateProductDTO = parseMultipartBody(req.body as Record<string, unknown>);

  if (req.file) {
    dto.image_url = `/public/uploads/products/${req.file.filename}`;
  }

  const product = await ProductService.updateProduct(Number(req.params.id), dto);
  res.json({ message: "Product patched", data: product });
};

/* ---- DELETE ----------------------------------------------- */

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  await ProductService.deleteProduct(Number(req.params.id));
  res.json({ message: "Product deleted" });
};
