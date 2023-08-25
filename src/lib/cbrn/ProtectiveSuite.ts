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
