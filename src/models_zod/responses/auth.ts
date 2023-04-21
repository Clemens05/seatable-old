import * as z from 'zod';

export const AuthResponseSchema = z.object({
  app_name: z.string(),
  access_token: z.string(),
  dtable_uuid: z.string(),
  dtable_server: z.string(),
  dtable_socket: z.string(),
  dtable_db: z.string(),
  workspace_id: z.number(),
  dtable_name: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
