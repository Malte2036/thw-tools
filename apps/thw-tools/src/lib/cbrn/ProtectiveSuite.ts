import { allSubstances, type Substance } from './Substance';

export type ProtectiveSuite = {
	name: string;
	substancesProtection: Map<Substance, string>;
};

//['ESK 1 PE', 'ESK S3 PE'];

export const allProtectiveSuites: ProtectiveSuite[] = [
	{
		name: 'ESK 1 PE',
		substancesProtection: new Map<Substance, string>([
			[allSubstances.find((e) => e.name == 'Ammoniak')!, '1a'],
			[allSubstances.find((e) => e.name == 'Ammoniumhydrogencarbonat')!, '1a']
		])
	},
	{
		name: 'ESK S3 PE',
		substancesProtection: new Map<Substance, string>([
			[allSubstances.find((e) => e.name == 'Ammoniak')!, '2a'],
			[allSubstances.find((e) => e.name == 'Ammoniumhydrogencarbonat')!, '3c'],
			[allSubstances.find((e) => e.name == 'Ammoniumnitratdünger')!, '1b']
		])
	}
];
