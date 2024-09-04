import { apiGet, apiGetFile, apiPost } from './apiGeneric';
import type {
	InventarItem,
	InventarItemDeviceId,
	InventarItemEvent,
	InventarItemEventBulk,
	InventarItemEventType
} from './inventarItem';

export async function getInventarItems(): Promise<InventarItem[]> {
	return await apiGet<InventarItem[]>('/inventar');
}

export async function getInventarItem(deviceId: string): Promise<InventarItem> {
	return await apiGet<InventarItem>(`/inventar/${deviceId}`);
}

export async function bulkCreateInventarItemEvents(
	deviceIds: InventarItemDeviceId[],
	batteryCount: number,
	eventType: InventarItemEventType
): Promise<void> {
	await apiPost<InventarItemEvent[]>(`/inventar/events/bulk`, {
		deviceIds,
		batteryCount,
		eventType
	});
}

export async function getInventarItemEvents(deviceId: string): Promise<InventarItemEvent[]> {
	return await apiGet<InventarItemEvent[]>(`/inventar/${deviceId}/events`);
}

export async function getInventarItemEventBulks(): Promise<InventarItemEventBulk[]> {
	return await apiGet<InventarItemEventBulk[]>(`/inventar/events/bulk`);
}

export async function exportInventarItemEventBulksAsCsv(): Promise<Blob> {
	return await apiGetFile(`/inventar/events/bulk/export`);
}
