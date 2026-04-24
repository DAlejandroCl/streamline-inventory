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
};
