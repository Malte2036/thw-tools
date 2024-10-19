import { z } from 'zod';

const inventarNummerRegex = /^[A-Za-z0-9-]+$/; // Assuming this is the regex pattern

export const InventoryItemZodSchema = z.object({
	organisation: z.string(),
	einheit: z.string(),
	ebene: z.number().int(),
	art: z.string().nullable().optional(),
	ausstattung: z.string(),
	hersteller: z.string().nullable().optional(),
	typ: z.string().nullable().optional(),
	inventarNummer: z
		.string()
		.regex(inventarNummerRegex, 'Invalid inventarNummer format')
		.nullable()
		.optional(),
	sachNummer: z.string().nullable().optional(),
	gerateNummer: z.string().nullable().optional()
});

export type InventoryItem = z.infer<typeof InventoryItemZodSchema>;

export const ImportInventoryItemsResultZodSchema = z.object({
	count: z.number().int(),
	einheiten: z.string().array()
});

export type ImportInventoryItemsResult = z.infer<typeof ImportInventoryItemsResultZodSchema>;
