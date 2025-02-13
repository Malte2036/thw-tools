import { z } from 'zod';

export const UpdateCustomDataSchema = z.object({
  lastScanned: z.date().optional(),
  note: z.string().max(1000).optional(),
});

export type UpdateCustomDataDto = z.infer<typeof UpdateCustomDataSchema>;
