import { allSubstances, type Substance } from './Substance';

export type ProtectiveSuite = {
	name: string;
	gasTight: boolean | undefined;
	substancesProtection: Map<Substance, string>;
};

//['ESK 1 PE', 'ESK S3 PE'];

export const allProtectiveSuites: ProtectiveSuite[] = [
	{
		name: 'ESK 1 PE',
		gasTight: false,
		substancesProtection: new Map<Substance, string>([
			[allSubstances.find((e) => e.name == 'Ammoniak')!, '1a'],
			[allSubstances.find((e) => e.name == 'Ammoniumhydrogencarbonat')!, '1a']
		])
	},
	{
		name: 'ESK S3 PE',
		gasTight: undefined,
		substancesProtection: new Map<Substance, string>([
			[allSubstances.find((e) => e.name == 'Ammoniak')!, '2a'],
			[allSubstances.find((e) => e.name == 'Ammoniumhydrogencarbonat')!, '3c'],
			[allSubstances.find((e) => e.name == 'Ammoniumnitratdünger')!, '1b']
		])
	},
	{
		name: 'Dummy',
		gasTight: true,
		substancesProtection: new Map<Substance, string>([])
	}
];

export function getDescriptionByProtectiveSuite(protectiveSuite: ProtectiveSuite) {
	let gasTightDescription = '';
	if (protectiveSuite.gasTight !== undefined) {
		gasTightDescription = ` und ist ${protectiveSuite.gasTight ? 'gasdicht' : 'nicht gasdicht'}`;
	}

	return `Der Schutzanzug ${protectiveSuite.name} ist ein Schutzanzug der Klasse ?${gasTightDescription}.`;
}
