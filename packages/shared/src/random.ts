/**
 * Generates a random integer between 0 (inclusive) and max (exclusive)
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Generates a hash code from a string
 * This is a simple but effective string hashing function
 *
 * @param str - String to hash
 * @returns A numeric hash value
 */
export function hashString(str: string): number {
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
 * Generates a deterministic random number based on a string seed
 * Always returns the same number for the same input string
 *
 * @param seed - String to use as seed
 * @param min - Minimum value (inclusive, default: 0)
 * @param max - Maximum value (exclusive, default: 1)
 * @returns A number between min and max
 */
export function randomFromSeed(seed: string, min: number = 0, max: number = 1): number {
  const hash = hashString(seed);
  // Generate a decimal between 0 and 1
  const decimal = (Math.abs(hash) % 1000000) / 1000000;

  // Scale to range
  return min + decimal * (max - min);
}
