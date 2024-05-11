import type {
	ClothingMeasurementImportance,
	ClothingName,
	ClothingSizesTable,
	ClothingType,
	HumanGender,
	HumanMeasurement,
	HumanMeasurementTolerance
} from './clothing';
import {
	clothingFriendlyNames,
	clothingMeasurementImportance,
	clothingTypeByName,
	humanMeasurementFriendlyNames
} from './clothingConstants';

import fs from 'fs/promises';
import path from 'path';

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
	}
}

export function clothingTypeToClothingMeasurementImportance(
	type: ClothingType,
	gender: HumanGender
): ClothingMeasurementImportance[] {
	try {
		return clothingMeasurementImportance[gender][type];
	} catch (error) {
		return [];
	}
}

export function humanMeasurementToFriendlyName(measurement: HumanMeasurement): string {
	try {
		return humanMeasurementFriendlyNames[measurement];
	} catch (error) {
		return measurement;
	}
}

export function humanGenderToFriendlyString(gender: HumanGender): string {
	switch (gender) {
		case 'M':
			return 'Männlich';
		case 'W':
			return 'Weiblich';
	}
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
