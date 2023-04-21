import * as z from 'zod';

export const AppendRowArgumentsSchema = z.object({
  tableName: z.string(),
  row: z.object({}),
});

export type AppendRowArguments = z.infer<typeof AppendRowArgumentsSchema>;
