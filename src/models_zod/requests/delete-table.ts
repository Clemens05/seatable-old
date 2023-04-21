import * as z from 'zod';

export const DeleteTableArgumentsSchema = z.object({
  tableName: z.string(),
});

export type DeleteTableArguments = z.infer<typeof DeleteTableArgumentsSchema>;
