import { Request, Response, NextFunction } from "express";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService
} from "../services/product.service.js";

// GET ALL
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProductsService();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const product = await getProductByIdService(id);
    res.json(product);

  } catch (error) {
    next(error);
  }
};

// CREATE
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await createProductService(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const product = await updateProductService(id, req.body);

    res.json({
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// PATCH (usa mismo service)
export const patchProduct = updateProduct;

// DELETE
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    await deleteProductService(id);

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};