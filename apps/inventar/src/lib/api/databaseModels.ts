import { z, type BRAND } from 'zod';

export type DatabaseId = string & BRAND<'DatabaseId'>;

export const DatabaseIdSchema = z.string().brand<'DatabaseId'>();
