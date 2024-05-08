import type {
	ClothingSizesTable,
	HumanMeasurement,
	HumanGender,
	MatchingClothingSizeTable,
	ClothingMeasurementImportance,
	ClothingName,
	ClothingType,
	HumanMeasurementTolerance,
	MatchingClothingSize
} from './clothing';

import { clothingFriendlyNames, clothingMeasurementImportance, clothingTypeByName, humanMeasurementFriendlyNames } from './clothingConstants'
import fs from 'fs/promises';
import path from 'path';

export function calculateMatchingClothingSizeForTables(
	tables: ClothingSizesTable[],
	gender: HumanGender,
	measurements: Record<HumanMeasurement, number | undefined>
): MatchingClothingSizeTable[] {
	return tables
		.filter((t) => t.gender == gender)
		.map((table) => ({
			...table,
			matchingClothingSizes: calculateMatchingClothingSizeForTable(table, measurements).sort(
				(a, b) => a.deviation - b.deviation
			)
		}));
}

function calculateMatchingClothingSizeForTable(
	table: ClothingSizesTable,
	measurements: Record<HumanMeasurement, number | undefined>
): MatchingClothingSize[] {
	return table.data.map((clothingSize) => {
		const derivations = table.measurementImportance.map((importance) => {
			const measurement = measurements[importance.measurement];
			const size = clothingSize[importance.measurement];
			const allowTolerance = importance.allowTolerance;

			if (!measurement) {
				// console.warn(
				// 	`Measurement ${importance.measurement} is missing for clothing size ${clothingSize.id} and table ${table.name}`
				// );
				return 1000;
			}

			if (size === undefined) {
				return 0;
			}

			return measurementMetric(
				measurement,
				size,
				allowTolerance ? getMeasurementTolerance(table.name) : undefined
			);
		});

		const sum = derivations.reduce((acc, curr) => acc + curr, 0);

		return {
			deviation: sum,
			clothingSize
		} satisfies MatchingClothingSize;
	});
}

export function measurementMetric(
	measurement: number,
	size: { min: number; max: number },
	tolerance?: HumanMeasurementTolerance
): number {
	const min = size.min * (1 - (tolerance?.down ?? 0));
	const max = size.max * (1 + (tolerance?.up ?? 0));
	if (min <= measurement && max >= measurement) return 0;

	if (min > measurement) return Math.abs(measurement - min);
	if (max < measurement) return Math.abs(max - measurement);

	throw new Error('This should never happen');
}
export function getMeasurementTolerance(name: ClothingName): HumanMeasurementTolerance {
	switch (name) {
		case 'DA_O':
		case 'DA_U':
		case 'DA_R':
		case 'TD_O':
		case 'TD_U':
			return { up: 0.02, down: 0.02 };
		case 'TB_O':
		case 'TB_U':
			return { up: 0.03, down: 0.03 };
		default:
			console.warn(
				`No tolerance defined for clothing name ${name}, using default tolerance of 0.02`
			);
			return { up: 0.02, down: 0.02 };
	}
}

export function getMissingMeasurements(
	tables: ClothingSizesTable[],
	measurements: Record<HumanMeasurement, number | undefined>
) {
	const missingMeasurements: Map<ClothingName, HumanMeasurement[]> = new Map();

	tables.forEach((table) => {
		const missingMeasurementsForTable = table.measurementImportance
			.filter((importance) => !measurements[importance.measurement])
			.map((importance) => importance.measurement);

		if (missingMeasurementsForTable.length > 0) {
			missingMeasurements.set(table.name, missingMeasurementsForTable);
		}
	});

	return missingMeasurements;
}

export function clothingNameToClothingType(name: ClothingName): ClothingType {
	try {
		return clothingTypeByName[name];
	} catch (error) {
		throw new Error(`Unknown clothing type ${name}`);
	}
}

export function clothingNameToFriendlyName(name: ClothingName): string {
	try {
		return clothingFriendlyNames[name];
	} catch (error) {
		return name;
	};
}

export function clothingTypeToClothingMeasurementImportance(
	type: ClothingType,
	gender: HumanGender
): ClothingMeasurementImportance[] {
	try {
		return clothingMeasurementImportance[gender][type]
	} catch (error) {
		return []
	};
}

export function humanMeasurementToFriendlyName(measurement: HumanMeasurement): string {
	try {
		return humanMeasurementFriendlyNames[measurement];
	} catch (error) {
		return measurement;
	}
}

export async function loadClothingSizesTables(): Promise<ClothingSizesTable[]> {
	const staticFolderPath = path.join(process.cwd(), 'static');
	const folderPath = path.join(staticFolderPath, 'clothing');
	const fileName = 'mea.json';
	const filePath = path.join(folderPath, fileName);

	const fileContent = await fs.readFile(filePath, 'utf-8');

	let data = JSON.parse(fileContent) as any[];

	return data
		.filter((d) => d.data.length > 0)
		.map((table) => {
			const type = clothingNameToClothingType(table.name);
			return {
				...table,
				type,
				measurementImportance: clothingTypeToClothingMeasurementImportance(type, table.gender)
			} satisfies ClothingSizesTable;
		});
}

export function humanGenderToFriendlyString(gender: HumanGender): string {
	switch (gender) {
		case 'M':
			return 'Männlich';
		case 'W':
			return 'Weiblich';
	}
}

export function isDeviationAcceptable(deviation: number) {
	return deviation < 1000;
}
