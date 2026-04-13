import Product from "../models/Product.model.js";

// CREATE PRODUCT
export const createProductService = async (data: any) => {
  const product = await Product.create(data);
  return product;
};

// GET ALL PRODUCTS
export const getProductsService = async () => {
  return await Product.findAll();
};

// GET PRODUCT BY ID
export const getProductByIdService = async (id: number) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// UPDATE PRODUCT
export const updateProductService = async (id: number, data: any) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.update(data);
  return product;
};

// DELETE PRODUCT
export const deleteProductService = async (id: number) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.destroy();
  return;
};