import * as z from 'zod';

export const DeleteColumnArgumentsSchema = z.object({
  tableName: z.string(),
  columnName: z.string(),
});

export type DeleteColumnArguments = z.infer<typeof DeleteColumnArgumentsSchema>;
