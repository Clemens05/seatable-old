import * as z from 'zod';
import { ColumnIDSchema, LinkIDSchema, ColumnTypeSchema, TableIDSchema } from './basic';

export const RowMetadataSchema = z.object({
  key: ColumnIDSchema,
  name: z.string(),
  type: ColumnTypeSchema,
  data: z
    .union([
      z.object({
        // auto-number
        digits: z.number(),
        format: z.string(),
        max_used_auto_number: z.number(),
        prefix: z.string().nullable(),
        prefix_type: z.any().nullable(),
      }),
      z.object({
        // number
        decimal: z.string(), // "comma" | ???
        enable_fill_default_value: z.boolean(),
        enable_precision: z.boolean(),
        format: z.string(), // "number" | ???
        precision: z.number(),
        thousands: z.string(), // "no" | ???
      }),
      z.object({
        // text
        default_value: z.string(),
        enable_check_format: z.boolean(),
        enable_fill_default_value: z.boolean(),
        format_check_type: z.string(), // "custom_format" | ???
        format_specification_value: z.any().nullable(),
      }),
      z.object({
        // date
        default_data_type: z.string(), // "specific_date" | ???
        default_value: z.string(),
        enable_fill_default_value: z.boolean(),
        format: z.string(), // DD.MM.YYYY
      }),
      z.object({
        // duration
        duration_format: z.string(), // "h:mm:ss" | ???
        format: z.string(), // "duration" | ???
      }),
      z.object({
        // link
        array_data: z
          .object({
            default_value: z.string(),
            enable_fill_default_value: z.boolean(),
          })
          .nullable(),
        array_type: z.string(), // RowTypeSchema
        display_column_key: ColumnIDSchema,
        is_internal_link: z.boolean(),
        is_multiple: z.boolean(),
        is_row_from_view: z.boolean(),
        link_id: LinkIDSchema,
        table_id: TableIDSchema,
        other_table_id: TableIDSchema,
        other_view_id: z.string(),
        result_type: z.string(), // "array" | ???
      }),
      z.object({
        // collaborator
        default_collaborator_type: z.string(), // "specific_users" | ???
        default_value: z.array(z.string()),
        enable_fill_default_value: z.boolean(),
        enable_send_notification: z.boolean(),
      }),
      z.object({}),
    ])
    .nullable(),
});

export type RowMetadata = z.infer<typeof RowMetadataSchema>;
