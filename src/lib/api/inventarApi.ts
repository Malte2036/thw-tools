import { PUBLIC_API_URL } from '$env/static/public';
import type {
	InventarItem,
	InventarItemDeviceId,
	InventarItemEvent,
	InventarItemEventType
} from '$lib/inventar/inventarItem';
import { clearTokenFromLocalStorage, getToken } from './authApi';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		clearTokenFromLocalStorage();
		throw new UnauthorizedError();
	}
};

export async function getInventarItems(): Promise<InventarItem[]> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to fetch inventar items');
	}

	return await res.json();
}

export async function getInventarItem(deviceId: string): Promise<InventarItem> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to fetch inventar item');
	}

	return await res.json();
}

export async function createInventarItem(
	deviceId: string,
	eventType: InventarItemEventType
): Promise<void> {
	console.log('createInventarItem', deviceId, eventType);

	const res = await fetch(`${PUBLIC_API_URL}/inventar`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			deviceId,
			eventType
		})
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to create inventar item');
	}
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
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}/events`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			eventType
		})
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to update inventar item');
	}
}

export async function getInventarItemEvents(deviceId: string): Promise<InventarItemEvent[]> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}/events`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to fetch inventar item events');
	}

	return await res.json();
}
