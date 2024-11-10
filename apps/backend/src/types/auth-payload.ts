import { z } from 'zod';

export const AuthPayloadSchema = z.object({
  /** The kindeId of the user */
  sub: z.string(),
  /** Token issuer */
  iss: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

export const IdTokenPayloadSchema = z.object({
  /** Unique identifier for the user */
  sub: z.string(),
  /** Application properties */
  application_properties: z
    .object({
      kp_app_name: z.object({}).optional(),
    })
    .optional(),
  /** Token hash */
  at_hash: z.string(),
  /** Audience - array of client IDs */
  aud: z.array(z.string()),
  /** Time when authentication occurred */
  auth_time: z.number(),
  /** Authorized party */
  azp: z.string(),
  /** User's email */
  email: z.string().email(),
  /** Email verification status */
  email_verified: z.boolean(),
  /** Token expiration time */
  exp: z.number(),
  /** User's family name */
  family_name: z.string(),
  /** User's given name */
  given_name: z.string(),
  /** Token issued at time */
  iat: z.number(),
  /** Token issuer */
  iss: z.string(),
  /** JWT ID */
  jti: z.string(),
  /** User's full name */
  name: z.string(),
  /** User's profile picture URL */
  picture: z.string().url(),
  /** Risk assessment time */
  rat: z.number(),
  /** Last update timestamp */
  updated_at: z.number(),
});

export type IdTokenPayload = z.infer<typeof IdTokenPayloadSchema>;
