import * as z from 'zod';

export const HeadersSchema = z.object({
  'Content-Type': z.literal('application/json'),
});

export type Headers = z.infer<typeof HeadersSchema>;

export const AuthHeadersSchema = HeadersSchema.merge(
  z.object({
    Authorization: z.string(),
  }),
);

export type AuthHeaders = z.infer<typeof AuthHeadersSchema>;
