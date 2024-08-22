import { PUBLIC_API_URL } from '$env/static/public';
import type {
	InventarItem,
	InventarItemDeviceId,
	InventarItemEvent,
	InventarItemEventType
} from '$lib/inventar/inventarItem';
import { apiGet, apiPost } from './apiGeneric';
import { clearTokenFromLocalStorage, getToken } from './authApi';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		clearTokenFromLocalStorage();
		throw new UnauthorizedError();
	}
};

export async function getInventarItems(): Promise<InventarItem[]> {
	return await apiGet<InventarItem[]>('/inventar');
}

export async function getInventarItem(deviceId: string): Promise<InventarItem> {
	return await apiGet<InventarItem>(`/inventar/${deviceId}`);
}

export async function createInventarItem(
	deviceId: string,
	eventType: InventarItemEventType
): Promise<void> {
	await apiPost<InventarItem>(`/inventar`, {
		deviceId,
		eventType
	});
}

export async function bulkCreateInventarItemEvents(
	data: { deviceId: InventarItemDeviceId; eventType: InventarItemEventType }[]
): Promise<void> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/events`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to bulk create inventar item events');
	}
}

export async function createInventarItemEvent(
	deviceId: string,
	eventType: InventarItemEventType
): Promise<void> {
	await apiPost<InventarItemEvent>(`/inventar/${deviceId}/events`, {
		eventType
	});
}

export async function getInventarItemEvents(deviceId: string): Promise<InventarItemEvent[]> {
	return await apiGet<InventarItemEvent[]>(`/inventar/${deviceId}/events`);
}
