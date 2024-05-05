import { describe, expect, test } from 'vitest';
import {
	calculateMatchingClothingSizeForTables,
	clothingTypeToClothingMeasurementImportance,
	isMeasurementInRange
} from './clothingUtils';
import type { ClothingSizes, ClothingSizesTable, HumanGender, HumanMeasurement } from './clothing';

describe('isMeasurementInRange', () => {
	test('isMeasurementInRange returns true when measurement is in range', () => {
		const result = isMeasurementInRange(180, 'EA_U', { min: 178, max: 182 }, false);

		expect(result).toBe(true);
	});

	test('isMeasurementInRange returns true when measurement is in range with tolerance', () => {
		const result = isMeasurementInRange(180, 'EA_U', { min: 178, max: 182 }, true);

		expect(result).toBe(true);
	});

	test('isMeasurementInRange returns false when measurement is below range', () => {
		const result = isMeasurementInRange(177, 'EA_U', { min: 178, max: 182 }, false);

		expect(result).toBe(false);
	});

	test('isMeasurementInRange returns false when measurement is above range', () => {
		const result = isMeasurementInRange(183, 'EA_U', { min: 178, max: 182 }, false);

		expect(result).toBe(false);
	});

	test('isMeasurementInRange returns false when measurement is below range with tolerance', () => {
		const result = isMeasurementInRange(170, 'EA_U', { min: 178, max: 182 }, true);

		expect(result).toBe(false);
	});

	test('isMeasurementInRange returns false when measurement is above range with tolerance', () => {
		const result = isMeasurementInRange(190, 'EA_U', { min: 178, max: 182 }, true);

		expect(result).toBe(false);
	});

	test('isMeasurementInRange return true when measurement is in range only with tolerance', () => {
		const result = isMeasurementInRange(177, 'EA_U', { min: 178, max: 182 }, true);

		expect(result).toBe(true);
	});
});

describe('calculateMatchingClothingSizeForTable', () => {
	test('calculateMatchingClothingSizeForTable returns the correct clothing size', () => {
		const size: ClothingSizes = {
			id: 1,
			size: 94,
			height: { min: 180, max: 184 },
			chestCircumference: undefined,
			waistCircumference: { min: 84, max: 87 },
			hipCircumference: { min: 96, max: 99 },
			insideLegLength: { min: 84, max: 86 }
		};
		const tables: ClothingSizesTable[] = [
			{
				name: 'TD_U',
				gender: 'M',
				type: 'Trousers',
				measurementImportance: clothingTypeToClothingMeasurementImportance('Trousers', 'M'),
				data: [size]
			}
		];
		const gender: HumanGender = 'M';
		const measurements: Record<HumanMeasurement, number | undefined> = {
			height: 184,
			chestCircumference: 97,
			waistCircumference: 85,
			hipCircumference: 97,
			insideLegLength: 86
		};

		const res = calculateMatchingClothingSizeForTables(tables, gender, measurements);
		expect(res[0].matchingClothingSize).toEqual(size);
	});
});
