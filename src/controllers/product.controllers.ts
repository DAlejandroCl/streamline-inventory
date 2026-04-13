import { Request, Response } from "express";
import Product from "../models/Product.model.js";

// GET ALL PRODUCTS
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    // PARAM PARSING
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error
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
    res.status(500).json({
      message: "Error creating product",
      error
    });
  }
};

// UPDATE PRODUCT (PUT)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // PARAM PARSING
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await product.update(req.body);

    res.json({
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error
    });
  }
};

// PARTIAL UPDATE (PATCH)
export const patchProduct = async (req: Request, res: Response) => {
  try {
    // PARAM PARSING
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await product.update(req.body);

    res.json({
      message: "Product partially updated",
      data: product
    });

  } catch (error) {
    res.status(500).json({
      message: "Error patching product",
      error
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // PARAM PARSING
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await product.destroy();

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error
    });
  }
};