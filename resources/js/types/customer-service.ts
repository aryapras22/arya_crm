import { z } from "zod";
import { Customer } from "./customers";
import { Product } from "./product";

export interface CustomerService {
  id: number;
  customer_id: number;
  product_id: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  customer?: Customer;
  product?: Product;
}

export const customerServiceFormSchema = z.object({
  product_id: z.number({
    required_error: "Please select a product",
  }),
  start_date: z.string({
    required_error: "Start date is required",
  }),
  end_date: z.string().nullable(),
});

export type CustomerServiceFormValues = z.infer<typeof customerServiceFormSchema>;