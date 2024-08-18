import { PUBLIC_API_URL } from '$env/static/public';
import type { InventarItem } from '$lib/inventar/inventarItem';
import { getToken } from './authApi';

export async function getInventarItems(): Promise<InventarItem[]> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	});

	if (!res.ok) {
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
		throw new Error('Failed to fetch inventar item');
	}

	return await res.json();
}

export async function createInventarItem(deviceId: string, isUsed?: boolean): Promise<void> {
	console.log('createInventarItem', deviceId, isUsed);

	const res = await fetch(`${PUBLIC_API_URL}/inventar`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			deviceId,
			eventType: isUsed ? 'borrowed' : 'returned'
		})
	});

	if (!res.ok) {
		throw new Error('Failed to create inventar item');
	}
}

export async function createInventarItemEvent(deviceId: string, isUsed: boolean): Promise<void> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}/event`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			eventType: isUsed ? 'borrowed' : 'returned'
		})
	});

	if (!res.ok) {
		throw new Error('Failed to update inventar item');
	}
}
