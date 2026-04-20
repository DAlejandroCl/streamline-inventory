/* ============================================================
   PRODUCT SERVICE
   Única fuente de verdad para la lógica de negocio de productos.
   Los controllers delegan aquí — nunca importan el modelo
   Sequelize directamente.

   Cada función lanza AppError con el status HTTP correcto
   para que el global error handler produzca respuestas
   consistentes sin try-catch en los controllers.
   ============================================================ */

import Product from "../models/Product.model.js";
import { AppError } from "../types/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

/* ---- READ -------------------------------------------------- */

export const getAllProducts = async (): Promise<Product[]> => {
  return Product.findAll();
};

export const getProductById = async (id: number): Promise<Product> => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

/* ---- WRITE ------------------------------------------------- */

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  return Product.create({ ...data });
};

/*
 * Usada tanto por PUT (reemplazo completo) como por PATCH
 * (actualización parcial). Sequelize solo actualiza los campos
 * presentes en data, por lo que ambas semánticas son correctas
 * dependiendo de lo que el controller envíe.
 */
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

/* ---- DELETE ------------------------------------------------ */

export const deleteProduct = async (id: number): Promise<void> => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await product.destroy();
};
