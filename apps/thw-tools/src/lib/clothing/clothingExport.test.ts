import { describe, expect, test } from 'vitest';
import type { MatchingClothingSizeTable } from './clothing';
import { convertClothingResultsToCSV } from './clothingExport';

describe('convertClothingResultsToCSV', () => {
	const tables: Partial<MatchingClothingSizeTable>[] = [
		{
			name: 'EA_O',
			gender: 'M',
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
			gender: 'M',
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
			'Vorname,Nachname,Kleidungsstück,Konfektionsgröße,Geschlecht,Notiz\nJohn,Doe,MEA Jacke,98,M,My custom note\nJohn,Doe,MEA Hose,46,M,My custom note\n'
		);
	});
});
