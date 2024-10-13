import { apiGet, apiGetFile, apiPost } from './apiGeneric';
import type {
	FunkItem,
	FunkItemDeviceId,
	FunkItemEvent,
	FunkItemEventBulk,
	FunkItemEventType
} from './funkModels';

export async function getFunkItems(): Promise<FunkItem[]> {
	return await apiGet<FunkItem[]>('/funk');
}

export async function getFunkItem(deviceId: string): Promise<FunkItem> {
	return await apiGet<FunkItem>(`/funk/${deviceId}`);
}

export async function bulkCreateFunkItemEvents(
	deviceIds: FunkItemDeviceId[],
	batteryCount: number,
	eventType: FunkItemEventType
): Promise<void> {
	await apiPost<FunkItemEvent[]>(`/funk/events/bulk`, {
		deviceIds,
		batteryCount,
		eventType
	});
}

export async function getFunkItemEvents(deviceId: string): Promise<FunkItemEvent[]> {
	return await apiGet<FunkItemEvent[]>(`/funk/${deviceId}/events`);
}

export async function getFunkItemEventBulks(): Promise<FunkItemEventBulk[]> {
	return await apiGet<FunkItemEventBulk[]>(`/funk/events/bulk`);
}

export async function exportFunkItemEventBulksAsCsv(): Promise<Blob> {
	return await apiGetFile(`/funk/events/bulk/export`);
}
