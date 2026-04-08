import { Request, Response } from "express";

// HANDLERS

export const getProducts = (req: Request, res: Response) => {
  res.json("GET Products");
};

export const createProduct = (req: Request, res: Response) => {
  res.json("POST Product");
};

export const updateProduct = (req: Request, res: Response) => {
  res.json("PUT Product");
};

export const patchProduct = (req: Request, res: Response) => {
  res.json("PATCH Product");
};

export const deleteProduct = (req: Request, res: Response) => {
  res.json("DELETE Product");
};
