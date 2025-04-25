import { z } from "zod";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  speed: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().nullable(),
  speed: z.string().nullable(),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;