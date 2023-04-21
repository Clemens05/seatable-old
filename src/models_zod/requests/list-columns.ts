import * as z from 'zod';

export const ListColumnsArgumentsSchema = z.object({
  tableName: z.string(),
  viewName: z.string().optional(),
});

export type ListColumnsArguments = z.infer<typeof ListColumnsArgumentsSchema>;
