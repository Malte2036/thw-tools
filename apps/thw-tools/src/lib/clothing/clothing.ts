export type ClothingSizes = {
	id: number;
	size: number;
	height: {
		min: number;
		max: number;
	};
	chestCircumference?: {
		min: number;
		max: number;
	};
	waistCircumference?: {
		min: number;
		max: number;
	};
	hipCircumference?: {
		min: number;
		max: number;
	};
	insideLegLength?: {
		min: number;
		max: number;
	};
};

export type HumanMeasurement =
	| 'height'
	| 'chestCircumference'
	| 'waistCircumference'
	| 'hipCircumference'
	| 'insideLegLength';

export type HumanMeasurementTolerance = {
	up: number;
	down: number;
};

export type HumanGender = 'M' | 'W';

export type ClothingMeasurementImportance = {
	measurement: HumanMeasurement;
	allowTolerance: boolean;
	factors?: {
		tooHigh: number;
		tooLow: number;
	}
};

export type ClothingName =
	| 'EA_O'
	| 'EA_U'
	| 'DA_O'
	| 'DA_U'
	| 'TB_O'
	| 'TB_U'
	| 'DA_R'
	| 'TD_O'
	| 'TD_U';

export type ClothingType = 'Jacket' | 'Suit' | 'Trousers' | 'Skirt' | 'Sweater';

export type ClothingSizesTable = {
	name: ClothingName;
	type: ClothingType;
	gender: HumanGender;
	data: ClothingSizes[];
	measurementImportance: ClothingMeasurementImportance[];
};

export type MatchingClothingSize = {
	deviation: number;
	clothingSize: ClothingSizes;
};

export type MatchingClothingSizeTable = ClothingSizesTable & {
	matchingClothingSizes: MatchingClothingSize[];
};
