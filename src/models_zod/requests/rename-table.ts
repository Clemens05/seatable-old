import * as z from 'zod';

export const RenameTableArgumentsSchema = z.object({
  tableName: z.string(),
  newTableName: z.string(),
});

export type RenameTableArguments = z.infer<typeof RenameTableArgumentsSchema>;
