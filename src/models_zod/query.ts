import * as z from 'zod';
import { OptionalRowSchema } from './row';
import { RowMetadataSchema } from './row-metadata';

export const QuerySchema = z.object({
  success: z.boolean().optional(),
  error_message: z.string().optional(),
  results: z.array(OptionalRowSchema),
  metadata: z.array(RowMetadataSchema),
});

export type Query = z.infer<typeof QuerySchema>;
