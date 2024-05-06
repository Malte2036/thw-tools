import type { MatchingClothingSizeTable } from './clothing';
import { clothingNameToFriendlyName, isDeviationAcceptable } from './clothingUtils';

export function convertClothingResultsToCSV(
	tables: MatchingClothingSizeTable[],
	personalInformation: {
		firstName?: string;
		lastName?: string;
		customNote?: string;
	}
) {
	const titleKeys = ['Vorname', 'Nachname', 'Notiz', 'Kleidungsstück', 'Konfektionsgröße'];

	const data = tables.map((table) => [
		personalInformation.firstName ?? '',
		personalInformation.lastName ?? '',
		personalInformation.customNote ?? '',
		clothingNameToFriendlyName(table.name),
		isDeviationAcceptable(table.matchingClothingSizes[0].deviation)
			? table.matchingClothingSizes[0].clothingSize.size.toString()
			: ''
	]);

	return convertToCSV(titleKeys, data);
}

function sanitizeInput(input: string): string {
	return input
		.replace(/,/g, '')
		.replace(/\n/g, '')
		.replace(/\r/g, '')
		.replace(/\t/g, '')
		.replace(/"/g, '');
}

function convertToCSV(titleKeys: string[], data: string[][]): string {
	const refinedData = [];
	refinedData.push(titleKeys);

	data.forEach((item) => {
		const sanitizedItem = item.map(sanitizeInput);
		refinedData.push(sanitizedItem);
	});

	let csvContent = '';

	refinedData.forEach((row) => {
		csvContent += row.join(',') + '\n';
	});

	return csvContent;
}

export function exportCSVFile(csvContent: string, fileName: string) {
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName; // File name for the downloaded JSON file
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
