/**
 * Shuffles an array in place using the Fisher-Yates algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/**
 * Sums all numbers in an array
 */
export const sumArray = (array: number[]): number => array.reduce((a, b) => a + b, 0);

/**
 * Checks if a string is in an array
 */
export const searchStringIsInArray = (
  searchString: string,
  array: (string | number | null | undefined)[]
) => {
  return array.some((item) => item?.toString().toLowerCase().includes(searchString.toLowerCase()));
};
