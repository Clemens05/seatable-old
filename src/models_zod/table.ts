import * as z from 'zod';
import { OptionalRowSchema } from './row';
import { ColumnSchema } from './column';
import { ViewSchema } from './view';

export const TableSchema = z.object({
  _id: z.string(),
  name: z.string(),
  rows: z.array(OptionalRowSchema),
  columns: z.array(ColumnSchema),
  views: z.array(ViewSchema),
  id_row_map: z.object({}),
});

export type Table = z.infer<typeof TableSchema>;
