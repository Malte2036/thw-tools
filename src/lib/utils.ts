import { version } from '$app/environment';

export const shuffle = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
};

// range: [0; max[
export function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function formatDate(date: number) {
	return new Date(date).toLocaleString('de-DE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: undefined
	});
}

export async function trackEvent(dataUmamiEvent: string | undefined) {
	if (!dataUmamiEvent) return;

	try {
		await umami.track(dataUmamiEvent);
	} catch (error) {
		console.warn(`Failed to track event "${dataUmamiEvent}"`);
	}
}

export async function trackIdentity() {
	try {
		console.log('trackIdentity', version);

		await umami.identify({
			build: formatDate(+version)
		});
	} catch (error) {
		console.warn(`Failed to track event "Identity"`);
	}
}

export const sumArray = (array: number[]) => array.reduce((a, b) => a + b, 0);
