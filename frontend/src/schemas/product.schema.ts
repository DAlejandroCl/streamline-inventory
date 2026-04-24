import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  sku: z.string().max(50, "SKU must be 50 characters or less").optional(),

  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),

  category_id: z.number().int().positive().nullable().optional(),

  price: z.number().positive("Price must be greater than 0"),

  cost: z.number().nonnegative("Cost must be 0 or greater").optional(),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock must be 0 or greater"),

  availability: z.boolean().optional(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
