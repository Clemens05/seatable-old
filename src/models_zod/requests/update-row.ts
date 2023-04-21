import * as z from 'zod';
import { RowIDSchema } from '../basic';

export const UpdateRowArgumentsSchema = z.object({
  tableName: z.string(),
  rowID: RowIDSchema,
  row: z.object({}),
});

export type UpdateRowArguments = z.infer<typeof UpdateRowArgumentsSchema>;
