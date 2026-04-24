/* ============================================================
   PRODUCT SERVICE
   Única fuente de verdad para la lógica de negocio de productos.
   Los controllers delegan aquí — nunca importan el modelo directo.
   ============================================================ */

import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import { AppError } from "../types/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

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

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

/* ---- WRITE ------------------------------------------------- */

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  return Product.create({ ...data });
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDTO
): Promise<Product> => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await product.update(data);
  return product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await product.destroy();
};
