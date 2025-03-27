/**
 * Default color to use when ID is not provided
 */
export const DEFAULT_COLOR = '#005b99';

/**
 * Generates a hash code from a string
 */
function hashString(str: string): number {
	let hash = 0;
	if (str.length === 0) return hash;

	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
}

/**
 * Converts HSL color values to hex string
 */
function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r, g, b;
	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	// Convert to hex
	const rHex = Math.round((r + m) * 255)
		.toString(16)
		.padStart(2, '0');
	const gHex = Math.round((g + m) * 255)
		.toString(16)
		.padStart(2, '0');
	const bHex = Math.round((b + m) * 255)
		.toString(16)
		.padStart(2, '0');

	return `#${rHex}${gHex}${bHex}`;
}

/**
 * Generates a medium-tone color that's not too light or dark
 */
function getMediumColor(id: string | undefined): string {
	if (!id) return '#005b99';

	const hash = hashString(id);

	// Medium-tone colors - not too light, not too dark
	const h = Math.abs(hash) % 360;
	const s = 50 + (Math.abs(hash >> 8) % 30); // 50-80% saturation
	const l = 45 + (Math.abs(hash >> 16) % 10); // 45-55% lightness

	return hslToHex(h, s, l);
}

/**
 * Generates a random color with good contrast based on an input string
 * Uses HSL color model to ensure good contrast and vibrant colors
 *
 * @param str - String to use as seed
 * @returns A hexadecimal color string
 */
function generateRandomColor(str: string): string {
	const hash = hashString(str);

	// Use the hash to generate HSL values
	// Hue: 0-360 degrees around the color wheel
	// Saturation: 65-90% for vibrant colors
	// Lightness: 45-65% for good contrast
	const h = Math.abs(hash) % 360;
	const s = 65 + (Math.abs(hash >> 8) % 25); // 65-90%
	const l = 45 + (Math.abs(hash >> 16) % 20); // 45-65%

	// Convert HSL to RGB
	const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l / 100 - c / 2;

	let r, g, b;
	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	// Convert to hex
	const rHex = Math.round((r + m) * 255)
		.toString(16)
		.padStart(2, '0');
	const gHex = Math.round((g + m) * 255)
		.toString(16)
		.padStart(2, '0');
	const bHex = Math.round((b + m) * 255)
		.toString(16)
		.padStart(2, '0');

	return `#${rHex}${gHex}${bHex}`;
}

/**
 * Generates a consistent color from an ID string using an algorithmic approach
 * Each ID will consistently generate the same color
 *
 * @param id - ID string to derive color from
 * @returns A color string
 */
export function getColorFromId(id: string | undefined): string {
	if (!id) return DEFAULT_COLOR;
	return generateRandomColor(id);
}

/**
 * Generates a color for a vehicle based on its ID
 *
 * @param vehicleId - Vehicle ID
 * @returns A consistent color for the vehicle
 */
export function getVehicleColor(vehicleId: string | undefined): string {
	return getMediumColor(vehicleId);
}

/**
 * Determines color based on rental status
 *
 * @param status - Rental status ('active', 'planned', etc.)
 * @returns Color corresponding to the status
 */
export function getRentalStatusColor(status: string): string {
	switch (status) {
		case 'active':
			return '#0066cc'; // Blue
		case 'planned':
			return '#666666'; // Gray
		default:
			return '#666666'; // Gray
	}
}
