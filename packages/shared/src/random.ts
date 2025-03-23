/**
 * Generates a random integer between 0 (inclusive) and max (exclusive)
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
