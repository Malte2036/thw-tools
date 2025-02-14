import { z } from 'zod';

export const UpdateCustomDataSchema = z.object({
  lastScanned: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date().optional()),
  note: z.string().max(1000).optional(),
});

export type UpdateCustomDataDto = z.infer<typeof UpdateCustomDataSchema>;
