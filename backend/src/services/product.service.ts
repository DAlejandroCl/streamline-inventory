/* ============================================================
   PRODUCT SERVICE
   Única fuente de verdad para la lógica de negocio de productos.
   Incluye validación básica de negocio para compensar la
   ausencia de express-validator en rutas multipart.
   ============================================================ */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import { AppError } from "../types/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ---- Helpers ---------------------------------------------- */

function deleteImageFile(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, "../../public", imageUrl);
  fs.unlink(filePath, () => { /* silently ignore */ });
}

function validateProductData(data: UpdateProductDTO): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new AppError("Product name is required", 400);
  }
  if (data.price === undefined || data.price === null || isNaN(data.price)) {
    throw new AppError("Price is required", 400);
  }
  if (data.price <= 0) {
    throw new AppError("Price must be greater than 0", 400);
  }
  if (data.stock === undefined || data.stock === null || isNaN(data.stock)) {
    throw new AppError("Stock is required", 400);
  }
  if (data.stock < 0) {
    throw new AppError("Stock must be 0 or greater", 400);
  }
}

/* ---- READ -------------------------------------------------- */

export const getAllProducts = async (): Promise<Product[]> => {
  return Product.findAll({
    include: [{ model: Category, attributes: ["id", "name", "color"] }],
    order: [["createdAt", "DESC"]],
  });
};

export const getProductById = async (id: number): Promise<Product> => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, attributes: ["id", "name", "color"] }],
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

/* ---- WRITE ------------------------------------------------- */

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  validateProductData(data);
  return Product.create({ ...data });
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDTO
): Promise<Product> => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found", 404);

  if (data.image_url && product.image_url && data.image_url !== product.image_url) {
    deleteImageFile(product.image_url);
  }

  await product.update(data);
  return product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found", 404);
  deleteImageFile(product.image_url);
  await product.destroy();
};
