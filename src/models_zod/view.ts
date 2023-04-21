import * as z from 'zod';
import { ColumnIDSchema } from './basic';

export const ViewSchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.string(),
  is_locked: z.boolean(),
  rows: z.array(z.any()),
  formula_rows: z.object({}),
  summaries: z.union([z.array(z.any()), z.object({})]),
  filter_conjunction: z.string(),
  filters: z.array(
    z.object({
      column_key: ColumnIDSchema,
      filter_predicate: z.string(), // "is_not" | "contains" | "is_on_or_after" | ???
      filter_term: z.any(),
      filter_term_modifier: z.string().optional(), // "exact_date" | ???
    }),
  ),
  sorts: z.array(
    z.object({
      column_key: ColumnIDSchema,
      sort_type: z.string(), // "up" | "down" | ???
    }),
  ),
  hidden_columns: z.array(z.string()),
  groupbys: z.array(
    z.object({
      column_key: ColumnIDSchema,
      count_type: z.string(), // "" | "month"
      sort_type: z.string(), // "up" | ???
    }),
  ),
  groups: z.array(z.any()),
});

export type View = z.infer<typeof ViewSchema>;
