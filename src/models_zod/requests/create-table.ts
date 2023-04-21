import * as z from 'zod';

export const CreateTableArgumentsSchema = z.object({
  tableName: z.string(),
  columns: z.array(z.object({})),
});

export type CreateTableArguments = z.infer<typeof CreateTableArgumentsSchema>;
