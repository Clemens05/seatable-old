import * as z from 'zod';

export const ColumnSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.string(),
  width: z.number(),
  editable: z.boolean(),
  resizable: z.boolean(),
  draggable: z.boolean().optional(),
  data: z
    .object({
      format: z.string().optional(),
    })
    .nullable(),
  permission_type: z.string().optional(),
  permitted_users: z.array(z.any()).optional(),
});

export type Column = z.infer<typeof ColumnSchema>;
