import * as z from 'zod';

export const ListRowsArgumentsSchema = z.object({
  tableName: z.string(),
  viewName: z.string().optional(),
  convertLinkID: z.boolean().optional(),
  orderBy: z.string().optional(),
  direction: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export type ListRowsArguments = z.infer<typeof ListRowsArgumentsSchema>;
