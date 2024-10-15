import { apiGet, apiGetFile, apiPost } from './apiGeneric';
import {
	FunkItemEventSchema,
	FunkItemSchema,
	type FunkItem,
	type FunkItemDeviceId,
	type FunkItemEvent,
	type FunkItemEventBulk,
	type FunkItemEventType
} from './funkModels';

export async function getFunkItems(): Promise<FunkItem[]> {
	return await apiGet<FunkItem[]>('/funk', (data) =>
		data.every((d) => {
			const result = FunkItemSchema.safeParse(d);
			if (!result.success) {
				console.error('Error parsing FunkItem:', result.error);
			}
			return result.success;
		})
	);
}

export async function getFunkItem(deviceId: string): Promise<FunkItem> {
	return await apiGet<FunkItem>(`/funk/${deviceId}`, (data) => {
		const result = FunkItemSchema.safeParse(data);
		if (!result.success) {
			console.error('Error parsing FunkItem:', result.error);
		}
		return result.success;
	});
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
	return await apiGet<FunkItemEvent[]>(`/funk/${deviceId}/events`, (data) =>
		data.every((d) => {
			const result = FunkItemEventSchema.safeParse(d);
			if (!result.success) {
				console.error('Error parsing FunkItemEvent:', result.error, d);
			}
			return result.success;
		})
	);
}

export async function getFunkItemEventBulks(): Promise<FunkItemEventBulk[]> {
	return await apiGet<FunkItemEventBulk[]>(`/funk/events/bulk`, (data) =>
		data.every((d) => {
			const result = FunkItemEventSchema.safeParse(d);
			if (!result.success) {
				console.error('Error parsing FunkItemEventBulk:', result.error, d);
			}
			return result.success;
		})
	);
}

export async function exportFunkItemEventBulksAsCsv(): Promise<Blob> {
	return await apiGetFile(`/funk/events/bulk/export`);
}
