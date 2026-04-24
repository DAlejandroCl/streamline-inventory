/* ============================================================
   CATEGORY CONTROLLERS
   Express 5 async propagation — sin try-catch.
   ============================================================ */

import { Request, Response } from "express";
import * as CategoryService from "../services/category.service.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../types/product.dto.js";

export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const categories = await CategoryService.getAllCategories();
  res.json(categories);
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await CategoryService.getCategoryById(Number(req.params.id));
  res.json(category);
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await CategoryService.createCategory(req.body as CreateCategoryDTO);
  res.status(201).json({ data: category });
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await CategoryService.updateCategory(
    Number(req.params.id),
    req.body as UpdateCategoryDTO
  );
  res.json({ message: "Category updated", data: category });
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  await CategoryService.deleteCategory(Number(req.params.id));
  res.json({ message: "Category deleted" });
};
