import * as z from 'zod';
import { ColumnIDSchema, RowIDSchema } from '../basic';

export const ListLinksArgumentsSchema = z.object({
  rowID: RowIDSchema,
  linkColumn: ColumnIDSchema,
  rows: z.array(
    z.object({
      rowID: RowIDSchema,
      offset: z.number().optional(),
      limit: z.number().optional(),
    }),
  ),
});

export type ListLinksArguments = z.infer<typeof ListLinksArgumentsSchema>;
