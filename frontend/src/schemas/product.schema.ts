import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio"),

  price: z
    .number()
    .positive("El precio debe ser mayor a 0"),

  availability: z.boolean().optional()
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;