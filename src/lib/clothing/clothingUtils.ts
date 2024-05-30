import type {
	ClothingName,
	ClothingSizesTable,
	HumanGender,
	HumanMeasurement,
	HumanMeasurementTolerance,
	MatchingClothingSize,
	MatchingClothingSizeTable
} from './clothing';
import { getMeasurementTolerance } from './clothingConstantUtils';
import type { ClothingInputValue } from './clothingInputStore';

export function calculateMatchingClothingSizesForInput(
	input: ClothingInputValue,
	tables: ClothingSizesTable[]
) {
	const inputData: Record<HumanMeasurement, number | undefined> = {
		height: input.height.length > 0 ? Number(input.height) : undefined,
		chestCircumference: input.chest.length > 0 ? Number(input.chest) : undefined,
		waistCircumference: input.waist.length > 0 ? Number(input.waist) : undefined,
		hipCircumference: input.hip.length > 0 ? Number(input.hip) : undefined,
		insideLegLength: input.insideLegLength.length > 0 ? Number(input.insideLegLength) : undefined
	};

	const missingMeasurements = getMissingMeasurements(tables, inputData);

	const sizes = calculateMatchingClothingSizeForTables(tables, input.gender, inputData);
	sizes.sort((a, b) => a.name.localeCompare(b.name));

	return {
		sizes,
		missingMeasurements
	};
}

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
			const factors = importance.factors ?? { tooHigh: 1, tooLow: 1 };

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
				factors,
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
	factors: { tooHigh: number; tooLow: number },
	tolerance?: HumanMeasurementTolerance
): number {
	const min = size.min * (1 - (tolerance?.down ?? 0));
	const max = size.max * (1 + (tolerance?.up ?? 0));
	if (min <= measurement && max >= measurement) return 0;

	if (min > measurement) return Math.abs(measurement - min) * factors.tooLow;
	if (max < measurement) return Math.abs(max - measurement) * factors.tooHigh;

	throw new Error('This should never happen');
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

export function isDeviationAcceptable(deviation: number) {
	return deviation < 1000;
}

export function getTableLink(name: String, gender: HumanGender, showTable: boolean): string {
	let link = `/clothing/${name}/${gender}`;

	if (showTable) {
		link += `?showTable=true`;
	}

	return link;
}
