import { z } from "zod";
import { User } from "./user";

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_by: number;
  creator: User;
  created_at: string;
  updated_at: string;
}


export const LEAD_STATUS = ['new', 'contacted', 'qualified', 'lost', 'converted'] as const;

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(8, {
    message: 'Please enter a valid phone number.',
  }),
  status: z.enum(LEAD_STATUS),
});