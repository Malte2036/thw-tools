import csa_ksf_2_tesimax from '$lib/cbrn/data/csa_ksf_2_tesimax.json';

export type ProtectiveSuite = {
	name: string;

	data: ProtectiveSuiteData[];
};

export type ProtectiveSuiteData = {
	'Chemisches Produkt': string;
	'CAS-Nr.': string;
	'Permetation ASTM F 109': number;
	'Permeation EN ISO 6529 Minuten': number;
	'Permeation EN ISO 6529 Klasse': number;
};

export const allProtectiveSuites: ProtectiveSuite[] = [
	{ name: 'CSA KSF 2 Tesimax', data: csa_ksf_2_tesimax as ProtectiveSuiteData[] }
];
