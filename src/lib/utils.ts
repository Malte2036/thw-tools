export const shuffle = (array: any[]) => {
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

export async function trackEvent(dataUmamiEvent: string | undefined) {
	if (!dataUmamiEvent) return;

	try {
		await umami.track(dataUmamiEvent);
	} catch (error) {
		console.warn(`Failed to track event "${dataUmamiEvent}"`);
	}
}

export const sumArray = (array: number[]) => array.reduce((a, b) => a + b, 0);
