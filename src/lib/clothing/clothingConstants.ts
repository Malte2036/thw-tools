import type {
	HumanGender,
	ClothingType,
	ClothingMeasurementImportance,
	ClothingName,
	HumanMeasurement
} from './clothing';

export const clothingMeasurementImportance: {
	[K in HumanGender]: { [M in ClothingType]: ClothingMeasurementImportance[] };
} = {
	W: {
		Jacket: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'hipCircumference', allowTolerance: true }
		],
		Suit: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'hipCircumference', allowTolerance: true }
		],
		Trousers: [
			{ measurement: 'waistCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'hipCircumference', allowTolerance: true },
			{ measurement: 'insideLegLength', allowTolerance: true }
		],
		Skirt: [
			{ measurement: 'waistCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'hipCircumference', allowTolerance: true }
		],
		Sweater: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true }
		]
	},

	M: {
		Jacket: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'waistCircumference', allowTolerance: true }
		],
		Suit: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'waistCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'insideLegLength', allowTolerance: true }
		],
		Trousers: [
			{ measurement: 'waistCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true },
			{ measurement: 'insideLegLength', allowTolerance: true }
		],
		Sweater: [
			{ measurement: 'chestCircumference', allowTolerance: false },
			{ measurement: 'height', allowTolerance: true }
		],
		Skirt: []
	}
};

export const clothingFriendlyNames: { [K in ClothingName]: string } = {
	EA_O: 'MEA Jacke',
	EA_U: 'MEA Hose',
	DA_O: 'Dienstanzugjacke',
	DA_U: 'Dienstanzughose',
	DA_R: 'Dienstanzugrock',
	TB_O: 'Thermojacke',
	TB_U: 'Thermohose',
	TD_O: 'Cargojacke',
	TD_U: 'Cargohose'
};

export const clothingTypeByName: { [K in ClothingName]: ClothingType } = {
	EA_O: 'Jacket',
	EA_U: 'Trousers',
	TB_U: 'Trousers',
	TD_U: 'Trousers',
	DA_U: 'Trousers',
	DA_R: 'Skirt',
	TB_O: 'Sweater',
	TD_O: 'Sweater',
	DA_O: 'Suit'
};

export const humanMeasurementFriendlyNames: { [K in HumanMeasurement]: string } = {
	height: 'Körpergröße',
	chestCircumference: 'Brustumfang',
	waistCircumference: 'Taillenumfang',
	hipCircumference: 'Hüftumfang',
	insideLegLength: 'Beininnenlänge'
};
