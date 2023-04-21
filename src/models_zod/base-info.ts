import * as z from 'zod';
import { TableSchema } from './table';

/**
 * response of: GET BaseInfo
 */
export const BaseInfoSchema = z.object({
  version: z.number(),
  format_version: z.number(),
  statistics: z.array(z.any()),
  links: z.array(z.any()),
  tables: z.array(TableSchema),
});

export type BaseInfo = z.infer<typeof BaseInfoSchema>;
