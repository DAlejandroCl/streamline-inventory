/* ============================================================
   CATEGORY SERVICE
   Lógica de negocio para el recurso Category.
   ============================================================ */

import Category from "../models/Category.model.js";
import { AppError } from "../types/AppError.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../types/product.dto.js";

/* ---- READ -------------------------------------------------- */

export const getAllCategories = async (): Promise<Category[]> => {
  return Category.findAll({ order: [["name", "ASC"]] });
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

/* ---- WRITE ------------------------------------------------- */

export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
  const existing = await Category.findOne({ where: { name: data.name } });

  if (existing) {
    throw new AppError("A category with this name already exists", 409);
  }

  return Category.create({ ...data });
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryDTO
): Promise<Category> => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await category.update(data);
  return category;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await category.destroy();
};
