import { BRAND, z } from 'zod';
import { OrganisationIdSchema, UserIdSchema, UserSchema } from '$lib/api/organisationModels';
import { InventoryItemIdSchema, InventoryItemSchema } from '$lib/api/inventoryModels';

export type InventurSessionId = string & BRAND<'InventurSessionId'>;
export const InventurSessionIdSchema = z.string().uuid().brand<'InventurSessionId'>();

export const InventurSessionStatusSchema = z.enum(['running', 'completed', 'aborted']);
export type InventurSessionStatus = z.infer<typeof InventurSessionStatusSchema>;

export const InventurSessionParticipantSchema = z.object({
	inventurSessionId: InventurSessionIdSchema,
	userId: UserIdSchema,
	user: UserSchema.optional() // User might not always be included
});
export type InventurSessionParticipant = z.infer<typeof InventurSessionParticipantSchema>;

export type InventurItemEntryId = string & BRAND<'InventurItemEntryId'>;
export const InventurItemEntryIdSchema = z.string().uuid().brand<'InventurItemEntryId'>();

export const InventurItemEntrySchema = z.object({
	id: InventurItemEntryIdSchema,
	inventurSessionId: InventurSessionIdSchema,
	inventarItemId: InventoryItemIdSchema.nullable(),
	scannedCount: z.number().int().min(0).nullable(),
	note: z.string().max(1000).nullable()
	// inventarItem is no longer included in the API response for addItemToSession
});
export type InventurItemEntry = z.infer<typeof InventurItemEntrySchema>;

export const InventurSessionSchema = z.object({
	id: InventurSessionIdSchema,
	startTime: z.coerce.date(), // Coerce string to Date
	endTime: z.coerce.date().nullable(),
	organisationId: OrganisationIdSchema,
	einheit: z.string().max(100),
	status: InventurSessionStatusSchema,
	participants: z.array(InventurSessionParticipantSchema).optional(), // Relation might not always be included
	items: z.array(InventurItemEntrySchema).optional() // Relation might not always be included
});
export type InventurSession = z.infer<typeof InventurSessionSchema>;

// Schema for the DTO used to create a session
export const CreateInventurSessionDtoSchema = z.object({
	einheit: z.string().min(1).max(100)
});
export type CreateInventurSessionDto = z.infer<typeof CreateInventurSessionDtoSchema>;

// Schema for the API response when creating a session (matches service response)
export const CreateInventurSessionResponseSchema = InventurSessionSchema.extend({
	participants: z.array(InventurSessionParticipantSchema) // Participants should be included on create
});
export type CreateInventurSessionResponse = z.infer<typeof CreateInventurSessionResponseSchema>;

// Inventur store state (remains an interface, not a Zod schema)
export interface InventurState {
	activeSession: InventurSession | null;
	isLoading: boolean;
	error: string | null;
}
