import * as z from 'zod';
import { LinkIDSchema, TableIDSchema } from '../basic';

export const CreateLinkArgumentsSchema = z.object({
  tableName: z.string(),
  otherTableName: z.string(),
  linkID: LinkIDSchema,
  tableID: TableIDSchema,
  otherTableID: TableIDSchema,
});

export type CreateLinkArguments = z.infer<typeof CreateLinkArgumentsSchema>;
