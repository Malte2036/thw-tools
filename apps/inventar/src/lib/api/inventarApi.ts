import { PUBLIC_API_URL } from '$env/static/public';
import type { InventarItem } from '$lib/inventar/inventarItem';

export async function getInventarItems(): Promise<InventarItem[]> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar`);

	if (!res.ok) {
		throw new Error('Failed to fetch inventar items');
	}

	return await res.json();
}

export async function getInventarItem(deviceId: string): Promise<InventarItem> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}`);

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
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			deviceId
		})
	});

	if (!res.ok) {
		throw new Error('Failed to create inventar item');
	}
}

export async function updateInventarItem(deviceId: string, isUsed: boolean): Promise<void> {
	const res = await fetch(`${PUBLIC_API_URL}/inventar/${deviceId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			isUsed
		})
	});

	if (!res.ok) {
		throw new Error('Failed to update inventar item');
	}
}
