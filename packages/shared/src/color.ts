import { hashString, randomFromSeed } from './random';

/**
 * Default color to use when ID is not provided
 */
export const DEFAULT_COLOR = '#005b99';

/**
 * Converts a number to a hex string with specified length
 *
 * @param num - Number to convert
 * @param len - Length of the hex string (default: 6)
 * @returns Hex string
 */
export function numToHex(num: number, len: number = 6): string {
  return Math.abs(num).toString(16).padStart(len, '0').substring(0, len);
}

/**
 * Preset color generation settings
 */
export const ColorPresets = {
  DEFAULT: {
    saturationRange: [65, 90], // Fairly saturated colors
    lightnessRange: [40, 60], // Medium brightness (not too light or dark)
  },
  VIBRANT: {
    saturationRange: [80, 100], // Very saturated colors
    lightnessRange: [45, 65], // Medium brightness leaning brighter
  },
  PASTEL: {
    saturationRange: [40, 60], // Less saturated colors
    lightnessRange: [70, 85], // Brighter colors
  },
  DARK: {
    saturationRange: [70, 90], // Saturated colors
    lightnessRange: [25, 40], // Darker colors
  },
  MEDIUM: {
    saturationRange: [50, 80], // Moderately saturated
    lightnessRange: [45, 55], // Medium brightness with narrow range
  },
};

/**
 * Generates a random color with good contrast based on an input string
 * Uses HSL color model to ensure good contrast and vibrant colors
 *
 * @param str - String to use as seed
 * @param options - Optional settings for color generation
 * @returns A hexadecimal color string
 */
export function generateRandomColor(
  str: string,
  options: {
    saturationRange?: [number, number]; // Default: [65, 90]
    lightnessRange?: [number, number]; // Default: [40, 60]
    preset?: keyof typeof ColorPresets;
  } = {}
): string {
  const hash = hashString(str);

  // Apply preset if specified
  let preset = undefined;
  if (options.preset) {
    preset = ColorPresets[options.preset];
  }

  // Set default ranges with good contrast values
  const satRange =
    options.saturationRange || preset?.saturationRange || ColorPresets.DEFAULT.saturationRange;
  const lightRange =
    options.lightnessRange || preset?.lightnessRange || ColorPresets.DEFAULT.lightnessRange;

  // Use the hash to generate HSL values
  // Hue: 0-360 degrees around the color wheel
  const h = Math.abs(hash) % 360;

  // Generate saturation and lightness from hash bits
  const s = satRange[0] + (Math.abs(hash >> 8) % (satRange[1] - satRange[0] + 1));
  const l = lightRange[0] + (Math.abs(hash >> 16) % (lightRange[1] - lightRange[0] + 1));

  return hslToHex(h, s, l);
}

/**
 * Generates vibrant, easily distinguishable colors from an ID
 * Ensures colors are not too light or dark
 *
 * @param id - ID string to base the color on
 * @returns Vibrant color in hex format
 */
export function getVibrantColor(id: string | undefined): string {
  if (!id) return DEFAULT_COLOR;
  return generateRandomColor(id, { preset: 'VIBRANT' });
}

/**
 * Generates medium-tone colors that are not too light or dark
 * Good for general purpose UI elements
 *
 * @param id - ID string to base the color on
 * @returns Medium-tone color in hex format
 */
export function getMediumColor(id: string | undefined): string {
  if (!id) return DEFAULT_COLOR;
  return generateRandomColor(id, { preset: 'MEDIUM' });
}

/**
 * Converts HSL color values to hex string
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color code
 */
export function hslToHex(h: number, s: number, l: number): string {
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
 * Generates a consistent color from an ID using a deterministic algorithm
 * The same ID will always produce the same color
 *
 * @param id - ID string to derive color from
 * @param options - Optional settings for color generation
 * @returns A color string
 */
export function getColorFromId(
  id: string | undefined,
  options?: {
    saturationRange?: [number, number];
    lightnessRange?: [number, number];
    preset?: keyof typeof ColorPresets;
  }
): string {
  if (!id) return DEFAULT_COLOR;
  return generateRandomColor(id, options);
}

/**
 * Calculates whether white or black text would be more readable
 * on the given background color
 *
 * @param hexColor - Background color in hex format
 * @returns 'black' or 'white' depending on which is more readable
 */
export function getContrastTextColor(hexColor: string): 'black' | 'white' {
  // Default to white if invalid color
  if (!hexColor || hexColor.length < 7) return 'white';

  // Extract RGB values
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate perceived brightness using weighted RGB (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for bright colors, white for dark colors
  return brightness > 128 ? 'black' : 'white';
}
