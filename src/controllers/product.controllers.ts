import { Request, Response } from "express";
import Product from "../models/Product.model.js";

// GET ALL
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching products",
    });
  }
};

// GET BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching product",
    });
  }
};

// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating product",
    });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);

    return res.json({
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating product",
    });
  }
};

// PATCH
export const patchProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);

    return res.json({
      message: "Product patched",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error patching product",
    });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.json({
      message: "Product deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting product",
    });
  }
};
