import { z } from "zod";
import { Project } from "./project";

export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'cancelled';

export const CUSTOMER_STATUS = ['active', 'inactive', 'suspended', 'cancelled'] as const;

export interface Customer {
  id: number;
  project_id: number;
  name: string;
  address: string | null;
  registration_date: string;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
  project: Project
}

export const customerFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  address: z.string().nullable(),
  registration_date: z.string(),
  status: z.enum(CUSTOMER_STATUS).default('active'),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;