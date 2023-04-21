import * as z from 'zod';

export const DuplicateTableArgumentsSchema = z.object({
  tableName: z.string(),
  duplicateRecords: z.boolean(),
});

export type DuplicateTableArguments = z.infer<typeof DuplicateTableArgumentsSchema>;
