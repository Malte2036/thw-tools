import { describe, expect, test } from 'vitest';
import {
	calculateMatchingClothingSizeForTables,
	clothingNameToClothingType,
	clothingTypeToClothingMeasurementImportance,
	measurementMetric
} from './clothingUtils';
import type { ClothingSizes, ClothingSizesTable, HumanGender, HumanMeasurement } from './clothing';

describe('measurementMetric', () => {
	test('measurementMetric returns 0 when measurement is within range', () => {
		const measurement = 184;
		const size = { min: 180, max: 184 };
		const allowTolerance = { up: 0.02, down: 0.02 };

		const res = measurementMetric(measurement, size, allowTolerance);

		expect(res).toBe(0);
	});

	test('measurementMetric returns negative number when measurement is below range', () => {
		const measurement = 170;
		const size = { min: 180, max: 184 };
		const allowTolerance = { up: 0.02, down: 0.02 };

		const res = measurementMetric(measurement, size, allowTolerance);

		expect(res).toBeGreaterThan(0);
	});

	test('measurementMetric returns positive number when measurement is above range', () => {
		const measurement = 190;
		const size = { min: 180, max: 184 };
		const allowTolerance = { up: 0.02, down: 0.02 };

		const res = measurementMetric(measurement, size, allowTolerance);

		expect(res).toBeGreaterThan(0);
	});

	test('measurementMetric returns 0 when measurement is within range without tolerance', () => {
		const measurement = 184;
		const size = { min: 180, max: 184 };

		const res = measurementMetric(measurement, size);

		expect(res).toBe(0);
	});

	test('measurementMetric returns negative number when measurement is below range without tolerance', () => {
		const measurement = 170;
		const size = { min: 180, max: 184 };

		const res = measurementMetric(measurement, size);

		expect(res).toBeGreaterThan(0);
	});

	test('measurementMetric returns positive number when measurement is above range without tolerance', () => {
		const measurement = 190;
		const size = { min: 180, max: 184 };

		const res = measurementMetric(measurement, size);

		expect(res).toBeGreaterThan(0);
	});
});

describe('calculateMatchingClothingSizeForTable', () => {
	const gender: HumanGender = 'M' as const;
	const measurements: Record<HumanMeasurement, number | undefined> = {
		height: 184,
		chestCircumference: 97,
		waistCircumference: 85,
		hipCircumference: 97,
		insideLegLength: 86
	} as const;

	test('calculateMatchingClothingSizeForTable returns the correct clothing size for TD_U', () => {
		const type = clothingNameToClothingType('TD_U');

		const size: ClothingSizes = {
			id: 1,
			size: 94,
			height: { min: 180, max: 184 },
			chestCircumference: undefined,
			waistCircumference: { min: 84, max: 87 },
			hipCircumference: { min: 96, max: 99 },
			insideLegLength: { min: 84, max: 86 }
		} as const;

		const tables: ClothingSizesTable[] = [
			{
				name: 'TD_U',
				gender,
				type,
				measurementImportance: clothingTypeToClothingMeasurementImportance(type, gender),
				data: [size]
			}
		];

		const res = calculateMatchingClothingSizeForTables(tables, gender, measurements);
		const matchingClothingSize = res[0].matchingClothingSizes[0];

		expect(matchingClothingSize.clothingSize).toBe(size);
		expect(matchingClothingSize.deviation).toBe(0);
	});

	test('calculateMatchingClothingSizeForTable returns undefined for DA_O with no matching size', () => {
		const type = clothingNameToClothingType('DA_O');

		const size: ClothingSizes = {
			id: 1,
			size: 98,
			height: { min: 183, max: 187 },
			chestCircumference: { min: 99, max: 102 },
			waistCircumference: { min: 89, max: 92 },
			hipCircumference: { min: 101, max: 104 },
			insideLegLength: undefined
		} as const;

		const tables: ClothingSizesTable[] = [
			{
				name: 'DA_O',
				gender,
				type,
				measurementImportance: clothingTypeToClothingMeasurementImportance(type, gender),
				data: [size]
			}
		];

		const res = calculateMatchingClothingSizeForTables(tables, gender, measurements);
		const matchingClothingSize = res[0].matchingClothingSizes[0];

		expect(matchingClothingSize.clothingSize).toBe(size);
		expect(matchingClothingSize.deviation).toBeGreaterThan(0);
	});

	// all measurements are undefined
	test('calculateMatchingClothingSizeForTable returns undefined for DA_O with no measurements', () => {
		const type = clothingNameToClothingType('DA_O');

		const size: ClothingSizes = {
			id: 1,
			size: 98,
			height: { min: 183, max: 187 },
			chestCircumference: { min: 99, max: 102 },
			waistCircumference: { min: 89, max: 92 },
			hipCircumference: { min: 101, max: 104 },
			insideLegLength: { min: 84, max: 86 }
		} as const;

		const tables: ClothingSizesTable[] = [
			{
				name: 'DA_O',
				gender,
				type,
				measurementImportance: clothingTypeToClothingMeasurementImportance(type, gender),
				data: [size]
			}
		];

		const res = calculateMatchingClothingSizeForTables(tables, gender, {
			height: undefined,
			chestCircumference: undefined,
			waistCircumference: undefined,
			hipCircumference: undefined,
			insideLegLength: undefined
		});
		const matchingClothingSize = res[0].matchingClothingSizes[0];

		expect(matchingClothingSize.deviation).toBeGreaterThan(0);
	});
});
