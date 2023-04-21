import * as z from 'zod';
import { RowIDSchema } from '../basic';

export const DeleteRowArgumentsSchema = z.object({
  tableName: z.string(),
  rowID: RowIDSchema,
});

export type DeleteRowArguments = z.infer<typeof DeleteRowArgumentsSchema>;
