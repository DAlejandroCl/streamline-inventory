import type {
  Product,
  ProductFormData,
} from "../../features/products/types/products";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

/**
 * 🔹 GET ALL PRODUCTS
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Error fetching products");
  }

  return res.json();
}

/**
 * 🔹 CREATE PRODUCT
 */
export async function createProduct(
  data: ProductFormData
): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error creating product");
  }

  return res.json();
}

/**
 * 🔹 GET PRODUCT BY ID
 */
export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Error fetching product");
  }

  return res.json();
}

/**
 * 🔹 UPDATE PRODUCT
 */
export async function updateProduct(
  id: string,
  data: ProductFormData
): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error updating product");
  }

  return res.json();
}

/**
 * 🔹 DELETE PRODUCT
 */
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error deleting product");
  }
}