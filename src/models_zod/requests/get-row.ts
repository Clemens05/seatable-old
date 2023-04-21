import * as z from 'zod';
import { RowIDSchema } from '../basic';

export const GetRowArgumentsSchema = z.object({
  rowID: RowIDSchema,
  tableName: z.string(),
  convert: z.boolean().optional(),
});

export type GetRowArguments = z.infer<typeof GetRowArgumentsSchema>;
