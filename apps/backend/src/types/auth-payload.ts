import { z } from 'zod';

export const AuthPayloadSchema = z.object({
  /** The kindeId of the user */
  sub: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
