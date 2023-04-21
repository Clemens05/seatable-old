import * as z from 'zod';
import { LinkIDSchema, TableIDSchema } from '../basic';

export const DeleteLinkArgumentsSchema = z.object({
  tableName: z.string(),
  otherTableName: z.string(),
  linkID: LinkIDSchema,
  tableID: TableIDSchema,
  otherTableID: TableIDSchema,
});

export type DeleteLinkArguments = z.infer<typeof DeleteLinkArgumentsSchema>;
