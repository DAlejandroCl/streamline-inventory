

export type Product = {
  id: number;
  name: string;
  price: number;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFormData = {
  name: string;
  price: number;
  availability?: boolean;
};