import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  availability: z.boolean().optional(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
