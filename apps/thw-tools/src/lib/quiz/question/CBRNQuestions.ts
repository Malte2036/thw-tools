import type { JSONQuestion } from '$lib/quiz/question/Question';

import aetzend from '$lib/assets/quiz/cbrn/gefahrklassen/aetzend.png';
import ansteckungsgefahr from '$lib/assets/quiz/cbrn/gefahrklassen/ansteckungsgefahr.png';
import entzuendbareflussigkeiten from '$lib/assets/quiz/cbrn/gefahrklassen/entzuendbareflussigkeiten.png';
import entzuended from '$lib/assets/quiz/cbrn/gefahrklassen/entzuended.png';
import explosiv from '$lib/assets/quiz/cbrn/gefahrklassen/explosiv.png';
import gasflasche from '$lib/assets/quiz/cbrn/gefahrklassen/gasflasche.png';
import giftig from '$lib/assets/quiz/cbrn/gefahrklassen/giftig.png';
import radioaktiv from '$lib/assets/quiz/cbrn/gefahrklassen/radioaktiv.png';

import piktogrammeAetzend from '$lib/assets/quiz/cbrn/gefahrpiktogramme/aetzend.svg';
import piktogrammeBrandfoerdernd from '$lib/assets/quiz/cbrn/gefahrpiktogramme/brandfoerdernd.svg';
import piktogrammeEntzuendlich from '$lib/assets/quiz/cbrn/gefahrpiktogramme/entzuendlich.svg';
import piktogrammeExplosiv from '$lib/assets/quiz/cbrn/gefahrpiktogramme/explosiv.svg';
import piktogrammeGesundheitsschaedlich from '$lib/assets/quiz/cbrn/gefahrpiktogramme/gesundheitsschaedlich.svg';
import piktogrammeReizend from '$lib/assets/quiz/cbrn/gefahrpiktogramme/reizend.svg';
import piktogrammeToxisch from '$lib/assets/quiz/cbrn/gefahrpiktogramme/toxisch.svg';
import piktogrammeUmwelt from '$lib/assets/quiz/cbrn/gefahrpiktogramme/umwelt.svg';

export const CBRNQuestions: JSONQuestion[] = [
	{
		answers: [
			'Gefahrgut sind Stoffe und Gegenstände, von denen auf Grund ihrer Natur, ihrer Eigenschaften oder ihres Zustandes im Zusammenhang mit der Beförderung Gefahren ausgehen können.',
			'Geld und wertvolle Antiquitäten.',
			'Getränke für die Einheiten.'
		],
		number: 1,
		text: 'Was ist ein Gefahrgut?',
		correctIndizies: [0]
	},
	{
		answers: [
			'Gefahrstoffe sind Stoffe, Zubereitungen und Erzeugnisse, die bestimmte gefährliche Eigenschaften aufweisen oder von denen chemisch-physikalische Gefahren ausgehen.',
			'Gefahrstoffe sind Stoffe die nur selten Helfer gefährlich werden können.',
			'Gefahrstoffe sind Stoffe, für die ein Helfer keine Schutzbekleidung benötigt.'
		],
		number: 2,
		text: 'Was sind Gefahrstoffe?',
		correctIndizies: [0]
	},
	{
		answers: [
			'Jede Helferin / jeder Helfer im THW.',
			'Nur die Präsidentin / der Präsident des THW.',
			'Nur der Auftraggeber.'
		],
		number: 3,
		text: 'Wer kann für Vergehen im Umgang mit gefährlichen Stoffen und Gütern zur Verantwortung gezogen werden?',
		correctIndizies: [0]
	},
	{
		answers: [
			'Möglichst großen Abstand zum Unfallort halten, alle Zündquellen fernhalten (Motor abstellen, Rauchverbot, etc.) und die Strasse sichern (Warnschilder aufstellen), Straßenbenutzer sowie Anwohner warnen.',
			'Verunfallte wenn möglich aus dem gefährlichen Bereich bringen (Schutzmaßnahmen unbedingt beachten – Eigenschutz!).',
			'Es müssen keine Schutzmaßnahmen getroffen werden.'
		],
		number: 4,
		text: 'Was ist bei einem Unfall mit gefährlichen Stoffen und Gütern zu beachten?',
		correctIndizies: [0, 1]
	},
	{
		answers: [
			'Kennzeichnung an den Verpackungen.',
			'Fahrzeugkennzeichnung, mitgeführte Fahrzeugpapiere und Merkblätter.',
			'Durch Fahrerbefragung.'
		],
		number: 5,
		text: 'Woran kann ich die Gefährdung, die von einem Gefahrguttransport ausgeht, eindeutig erkennen?',
		correctIndizies: [0, 1]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 6,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: explosiv,
		correctIndizies: [0]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 7,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: gasflasche,
		correctIndizies: [1]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 8,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: entzuendbareflussigkeiten,
		correctIndizies: [2]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 9,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: entzuended,
		correctIndizies: [3]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 10,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: giftig,
		correctIndizies: [4]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 11,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: ansteckungsgefahr,
		correctIndizies: [5]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 12,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: radioaktiv,
		correctIndizies: [6]
	},
	{
		answers: [
			'Explosive Stoffe',
			'Gase (nicht entzündbar)',
			'Entzündbare flüssige Stoffe',
			'Entzündend wirkende Stoffe',
			'Giftige Stoffe',
			'Ansteckungsgefährliche Stoffe',
			'Radioaktive Stoffe',
			'Ätzende Stoffe'
		],
		number: 13,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: aetzend,
		correctIndizies: [7]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 14,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeExplosiv,
		correctIndizies: [0]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 15,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeEntzuendlich,
		correctIndizies: [1]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 16,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeBrandfoerdernd,
		correctIndizies: [2]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 17,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeAetzend,
		correctIndizies: [3]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 18,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeToxisch,
		correctIndizies: [4]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 19,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeGesundheitsschaedlich,
		correctIndizies: [5]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 20,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeReizend,
		correctIndizies: [6]
	},
	{
		answers: [
			'Explosiv',
			'Entzündbar',
			'Endzündend',
			'Ätzwirkung',
			'akute Toxizität',
			'Gesundheitsgefahren',
			'Reizwirkung',
			'Gewässergefährdend'
		],
		number: 21,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: piktogrammeUmwelt,
		correctIndizies: [7]
	}
];
