/**
 * Format a date with German locale
 */
export function formatDate(date: number | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date to a friendly string
 */
export const dateToFriendlyString = (date: Date) => {
  let options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format
  };

  let formattedDate = new Intl.DateTimeFormat('de-DE', options).format(date);
  return `${formattedDate}Uhr`;
};
