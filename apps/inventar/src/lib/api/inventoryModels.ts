import { z } from 'zod';

const inventarNummerRegex = /^[A-Za-z0-9-]+$/; // Assuming this is the regex pattern

export const InventoryItemZodSchema = z.object({
	organisation: z.string(),
	einheit: z.string(),
	ebene: z.number().int(),
	art: z.string().optional(),
	ausstattung: z.string(),
	hersteller: z.string().optional(),
	typ: z.string().optional(),
	inventarNummer: z.string().regex(inventarNummerRegex, 'Invalid inventarNummer format').optional(),
	sachNummer: z.string().optional(),
	gerateNummer: z.string().optional()
});

export type InventoryItem = z.infer<typeof InventoryItemZodSchema>;
