import * as z from 'zod';
import { RowIDSchema } from '../basic';

export const InsertRowArgumentsSchema = z.object({
  tableName: z.string(),
  anchorRowID: RowIDSchema,
  rowInsertPosition: z.union([z.literal('insert_above'), z.literal('insert_below')]),
  row: z.object({}),
});

export type InsertRowArguments = z.infer<typeof InsertRowArgumentsSchema>;
