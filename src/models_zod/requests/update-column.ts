import * as z from 'zod';
import { ColumnTypeSchema } from '../basic';

export const UpdateColumnArgumentsSchema = z.intersection(
  z.object({
    tableName: z.string(),
    columnName: z.string(),
  }),
  z.union([
    z.object({
      opType: z.literal('modify_column_type'),
      newColumnType: ColumnTypeSchema,
    }),
    z.object({
      opType: z.literal('rename_column'),
      newColumnName: z.string(),
    }),
    z.object({
      opType: z.literal('resize_column'),
      newColumnWidth: z.number(),
    }),
    z.object({
      opType: z.literal('move_column'),
      targetColumn: z.string(),
    }),
    z.object({
      opType: z.literal('freeze_column'),
      frozen: z.boolean(),
    }),
  ]),
);

export type UpdateColumnArguments = z.infer<typeof UpdateColumnArgumentsSchema>;
