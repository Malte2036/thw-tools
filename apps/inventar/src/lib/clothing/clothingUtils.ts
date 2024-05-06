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
	switch (name) {
		case 'EA_O':
			return 'Jacket';
		case 'EA_U':
		case 'TB_U':
		case 'TD_U':
		case 'DA_U':
			return 'Trousers';
		case 'DA_R':
			return 'Skirt';
		case 'TB_O':
		case 'TD_O':
			return 'Sweater';
		case 'DA_O':
			return 'Suit';
		default:
			throw new Error(`Unknown clothing type ${name}`);
	}
}

export function clothingNameToFriendlyName(name: ClothingName) {
	switch (name) {
		case 'EA_O':
			return 'MEA Jacke';
		case 'EA_U':
			return 'MEA Hose';
		case 'DA_O':
			return 'Dienstanzugjacke';
		case 'DA_U':
			return 'Dienstanzughose';
		case 'DA_R':
			return 'Dienstanzugrock';
		case 'TB_O':
			return 'Thermojacke';
		case 'TB_U':
			return 'Thermohose';
		case 'TD_O':
			return 'Cargojacke';
		case 'TD_U':
			return 'Cargohose';
		default:
			return name;
	}
}

export function clothingTypeToClothingMeasurementImportance(
	type: ClothingType,
	gender: HumanGender
): ClothingMeasurementImportance[] {
	if (gender == 'W') {
		// woman
		switch (type) {
			case 'Jacket':
				return [
					{ measurement: 'chestCircumference', allowTolerance: false },
					{ measurement: 'height', allowTolerance: true },
					{ measurement: 'hipCircumference', allowTolerance: true }
				];
			case 'Suit':
				return [
					{ measurement: 'chestCircumference', allowTolerance: false },
					{ measurement: 'height', allowTolerance: true },
					{ measurement: 'hipCircumference', allowTolerance: true }
				];
			case 'Trousers':
				return [
					{ measurement: 'waistCircumference', allowTolerance: false },
					{ measurement: 'height', allowTolerance: true },
					{ measurement: 'hipCircumference', allowTolerance: true },
					{ measurement: 'insideLegLength', allowTolerance: true }
				];
			case 'Skirt':
				return [
					{ measurement: 'waistCircumference', allowTolerance: false },
					{ measurement: 'height', allowTolerance: true },
					{ measurement: 'hipCircumference', allowTolerance: true }
				];
			case 'Sweater':
				return [
					{ measurement: 'chestCircumference', allowTolerance: false },
					{ measurement: 'height', allowTolerance: true }
				];

			default:
				console.warn(
					`No measurement importance defined for clothing type ${type} and gender ${gender}`
				);
				return [];
		}
	}

	// man
	switch (type) {
		case 'Jacket':
			return [
				{ measurement: 'chestCircumference', allowTolerance: false },
				{ measurement: 'height', allowTolerance: true },
				{ measurement: 'waistCircumference', allowTolerance: true }
			];
		case 'Suit':
			return [
				{ measurement: 'chestCircumference', allowTolerance: false },
				{ measurement: 'waistCircumference', allowTolerance: false },
				{ measurement: 'height', allowTolerance: true },
				{ measurement: 'insideLegLength', allowTolerance: true }
			];

		case 'Trousers':
			return [
				{ measurement: 'waistCircumference', allowTolerance: false },
				{ measurement: 'height', allowTolerance: true },
				{ measurement: 'insideLegLength', allowTolerance: true }
			];
		case 'Sweater':
			return [
				{ measurement: 'chestCircumference', allowTolerance: false },
				{ measurement: 'height', allowTolerance: true }
			];

		default:
			console.warn(`No measurement importance defined for clothing type ${type}`);
			return [];
	}
}

export function humanMeasurementToFriendlyName(measurement: HumanMeasurement) {
	switch (measurement) {
		case 'height':
			return 'Körpergröße';
		case 'chestCircumference':
			return 'Brustumfang';
		case 'waistCircumference':
			return 'Taillenumfang';
		case 'hipCircumference':
			return 'Hüftumfang';
		case 'insideLegLength':
			return 'Beininnenlänge';
		default:
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
