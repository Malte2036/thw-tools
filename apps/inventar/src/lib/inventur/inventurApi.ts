import { apiGet, apiPost, apiPut } from '$lib/api/apiGeneric';
import {
	type CreateInventurSessionDto,
	CreateInventurSessionResponseSchema,
	InventurItemEntrySchema,
	type InventurSession,
	type InventurItemEntry,
	InventurSessionSchema
} from './types';
import { z } from 'zod';

const API_BASE_PATH = '/inventur/sessions';

// Update AddItemDto Schema to match backend
const AddItemDtoSchema = z.object({
	inventarNummer: z.string().min(1)
});
export type AddItemDto = z.infer<typeof AddItemDtoSchema>;

// DTO for setting count (matches backend)
const SetItemCountDtoSchema = z.object({
	count: z.number().int().min(0)
});
export type SetItemCountDto = z.infer<typeof SetItemCountDtoSchema>;

/**
 * Calls the backend to create a new inventur session.
 * @param createDto - The data required to create the session (currently just 'einheit').
 * @returns The newly created InventurSession.
 */
export async function createInventurSession(
	createDto: CreateInventurSessionDto
): Promise<InventurSession> {
	const response = await apiPost<InventurSession>(
		`${API_BASE_PATH}`,
		createDto,
		(data): data is InventurSession => CreateInventurSessionResponseSchema.safeParse(data).success
	);
	return response.data;
}

/**
 * Calls the backend to add/increment an item (by inventarNummer) in a session.
 */
export async function addItemToSession(
	sessionId: string,
	addItemDto: AddItemDto // Expects { inventarNummer: string }
): Promise<InventurItemEntry> {
	const response = await apiPost<InventurItemEntry>(
		`${API_BASE_PATH}/${sessionId}/items`,
		addItemDto, // Send object with inventarNummer
		(data): data is InventurItemEntry => InventurItemEntrySchema.safeParse(data).success
	);
	return response.data;
}

/**
 * Calls the backend to set the count for a specific item in a session.
 */
export async function setItemCount(
	sessionId: string,
	inventarItemId: string,
	setCountDto: SetItemCountDto
): Promise<InventurItemEntry> {
	const response = await apiPut<InventurItemEntry>(
		`${API_BASE_PATH}/${sessionId}/items/${inventarItemId}`,
		setCountDto,
		(data): data is InventurItemEntry => InventurItemEntrySchema.safeParse(data).success
	);
	return response.data;
}

/**
 * Calls the backend to fetch details for a specific inventur session.
 */
export async function getInventurSessionDetails(sessionId: string): Promise<InventurSession> {
	const response = await apiGet<InventurSession>(
		`${API_BASE_PATH}/${sessionId}`,
		(data): data is InventurSession => InventurSessionSchema.safeParse(data).success
	);
	return response.data;
}

// TODO: Add function to load a specific session by ID using apiGet and InventurSessionSchema
