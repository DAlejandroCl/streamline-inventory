/* ============================================================
   PRODUCT SERVICE
   getAllProducts ahora soporta paginación server-side.

   PAGINACIÓN:
   - page:  número de página (1-indexed, default: 1)
   - limit: items por página (default: 20, max: 100)
   - Devuelve { data, total, page, totalPages } para que el
     frontend pueda renderizar controles de navegación.

   Sin paginación (page=0 o limit=0): devuelve todos los
   productos. Usado internamente por el Dashboard.
   ============================================================ */

import path from "path";
import fs   from "fs";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import Product  from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import { AppError } from "../types/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../types/product.dto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ---- Types ----------------------------------------------- */

export type PaginationOptions = {
  page:   number;
  limit:  number;
  search?: string;
};

export type PaginatedProducts = {
  data:        Product[];
  total:       number;
  page:        number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrev:     boolean;
};

/* ---- Helpers ---------------------------------------------- */

function deleteImageFile(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, "../..", imageUrl);
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

const INCLUDE_CATEGORY = [
  { model: Category, attributes: ["id", "name", "color"] },
];

/* ---- READ -------------------------------------------------- */

export const getAllProducts = async (
  opts: PaginationOptions = { page: 1, limit: 20 }
): Promise<PaginatedProducts> => {
  const MAX_LIMIT = 100;
  const limit     = Math.min(Math.max(1, opts.limit), MAX_LIMIT);
  const page      = Math.max(1, opts.page);
  const offset    = (page - 1) * limit;

  /* Search filter — case insensitive, matches name or SKU */
  const where = opts.search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${opts.search}%` } },
          { sku:  { [Op.iLike]: `%${opts.search}%` } },
        ],
      }
    : {};

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: INCLUDE_CATEGORY,
    order:   [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data:       rows,
    total:      count,
    page,
    totalPages,
    hasNext:    page < totalPages,
    hasPrev:    page > 1,
  };
};

/* Sin paginación — usado por el Dashboard para métricas */
export const getAllProductsUnpaginated = async (): Promise<Product[]> => {
  return Product.findAll({
    include: INCLUDE_CATEGORY,
    order:   [["createdAt", "DESC"]],
  });
};

export const getProductById = async (id: number): Promise<Product> => {
  const product = await Product.findByPk(id, {
    include: INCLUDE_CATEGORY,
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

  if (data.image_url === undefined) {
    delete data.image_url;
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
