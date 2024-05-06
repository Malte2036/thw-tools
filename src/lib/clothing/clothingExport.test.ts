import { describe, expect, test } from 'vitest';
import type { MatchingClothingSizeTable } from './clothing';
import { convertClothingResultsToCSV } from './clothingExport';

describe('convertClothingResultsToCSV', () => {
	const tables: Partial<MatchingClothingSizeTable>[] = [
		{
			name: 'EA_O',
			matchingClothingSizes: [
				{
					deviation: 0,
					clothingSize: {
						id: 1,
						size: 98,
						height: { min: 183, max: 187 }
					}
				}
			]
		},
		{
			name: 'EA_U',
			matchingClothingSizes: [
				{
					deviation: 2,
					clothingSize: {
						id: 2,
						size: 46,
						height: { min: 180, max: 184 }
					}
				}
			]
		}
	] as MatchingClothingSizeTable[];

	const personalInformation = {
		firstName: 'John',
		lastName: 'Doe',
		customNote: 'My custom note'
	} as const;

	test('convertClothingResultsToCSV returns CSV string', () => {
		const csv = convertClothingResultsToCSV(
			tables as MatchingClothingSizeTable[],
			personalInformation
		);

		expect(csv).toBe(
			'Vorname,Nachname,Notiz,Kleidungsstück,Konfektionsgröße\nJohn,Doe,My custom note,MEA Jacke,98\nJohn,Doe,My custom note,MEA Hose,46\n'
		);
	});
});
