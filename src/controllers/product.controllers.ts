import { Request, Response } from "express";
import Product from "../models/Product.model.js";

// GET ALL PRODUCTS
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating product"
    });
  }
};

// HELPER - PARSE ID
const parseId = (id: string | string[]): number | null => {
  if (Array.isArray(id)) return null;

  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
};

// UPDATE (PUT)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const parsedId = parseId(req.params.id);

    if (!parsedId) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findByPk(parsedId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);

    res.json({
      message: "Product updated",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product"
    });
  }
};

// PATCH
export const patchProduct = async (req: Request, res: Response) => {
  try {
    const parsedId = parseId(req.params.id);

    if (!parsedId) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findByPk(parsedId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);

    res.json({
      message: "Product patched",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error patching product"
    });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const parsedId = parseId(req.params.id);

    if (!parsedId) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findByPk(parsedId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.json({
      message: "Product deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product"
    });
  }
};