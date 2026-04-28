/* ============================================================
   PRODUCT SERVICE
   Única fuente de verdad para la lógica de negocio de productos.
   Los controllers delegan aquí — nunca importan el modelo directo.

   deleteProduct: elimina también el archivo de imagen del disco
   para evitar acumulación de archivos huérfanos.
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

function deleteImageFile(imageUrl: string | null): void {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, "../../public", imageUrl);
  fs.unlink(filePath, () => {
    /* Silently ignore — file may have been deleted manually */
  });
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
  return Product.create({ ...data });
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDTO
): Promise<Product> => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found", 404);

  /*
   * Si se sube una imagen nueva y el producto ya tenía una,
   * eliminamos el archivo anterior del disco.
   */
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
