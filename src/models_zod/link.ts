import * as z from 'zod';
import { RowIDSchema, ColumnTypeSchema } from './basic';

export const LinkSchema = z.object({
  rowID: RowIDSchema,
  display_value: z.string(),
  type: ColumnTypeSchema,
  data: z.object({
    default_value: z.string(),
    enable_fill_default_value: z.boolean(),
  }),
});

export type Link = z.infer<typeof LinkSchema>;
