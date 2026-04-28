/* ============================================================
   PRODUCT TYPES
   image_url: path relativo devuelto por el backend.
   El frontend construye la URL completa: VITE_API_URL + image_url
   ============================================================ */

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Product = {
  id: number;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: number | null;
  category: Category | null;
  price: number;
  cost: number | null;
  stock: number;
  availability: boolean;
  image_url: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFormData = {
  name: string;
  sku?: string;
  description?: string;
  category_id?: number | null;
  price: number;
  cost?: number;
  stock: number;
  availability?: boolean;
  image_url?: string | null;
};
