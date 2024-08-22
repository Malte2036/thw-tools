import { PUBLIC_API_URL } from '$env/static/public';
import type {
	InventarItem,
	InventarItemDeviceId,
	InventarItemEvent,
	InventarItemEventType
} from '$lib/inventar/inventarItem';
import { apiGet, apiPost } from './apiGeneric';

export async function getInventarItems(): Promise<InventarItem[]> {
	return await apiGet<InventarItem[]>('/inventar');
}

export async function getInventarItem(deviceId: string): Promise<InventarItem> {
	return await apiGet<InventarItem>(`/inventar/${deviceId}`);
}

export async function bulkCreateInventarItemEvents(
	data: { deviceId: InventarItemDeviceId; eventType: InventarItemEventType }[]
): Promise<void> {
	await apiPost<InventarItemEvent[]>(`/inventar/events`, data);
}

export async function getInventarItemEvents(deviceId: string): Promise<InventarItemEvent[]> {
	return await apiGet<InventarItemEvent[]>(`/inventar/${deviceId}/events`);
}
