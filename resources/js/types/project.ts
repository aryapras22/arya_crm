import { z } from "zod";
import { Lead } from "./lead";
import { User } from "./user";

export type ProjectStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

export const PROJECT_STATUS = ['draft', 'pending_approval', 'approved', 'rejected'] as const;

export interface Project {
  id: number;
  lead_id: number;
  sales_id: number;
  status: ProjectStatus;
  notes: string | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  lead: Lead;
  sales_person?: User;
  approver?: User;
}

export const projectFormSchema = z.object({
  lead_id: z.number({
    required_error: "Please select a lead",
  }),
  notes: z.string().nullable(),
  status: z.enum(PROJECT_STATUS).default('draft'),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;