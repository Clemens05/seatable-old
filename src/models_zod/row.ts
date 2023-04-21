import * as z from 'zod';
import { RowIDSchema } from './basic';

/**
 * response of: GET ListRows
 */
export const RowSchema = z
  .object({
    _id: RowIDSchema,
    _mtime: z.string(),
    _ctime: z.string(),
    _participants: z.array(z.any()).optional(),
    _archived: z.boolean().optional(),
    _creator: z.string().nullable().optional(),
    _last_modifier: z.string().nullable().optional(),
    _locked: z.boolean().nullable().optional(),
    _locked_by: z.string().nullable().optional(),
  })
  .passthrough();

export type Row = z.infer<typeof RowSchema>;

export const OptionalRowSchema = RowSchema.partial();

export type OptionalRow = z.infer<typeof OptionalRowSchema>;
