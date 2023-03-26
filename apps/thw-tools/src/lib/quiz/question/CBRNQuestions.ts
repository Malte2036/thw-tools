import type { Question } from '$lib/quiz/question/Question';

import radioaktiv from '$lib/assets/quiz/cbrn/radioaktiv.png';
import aetzend from '$lib/assets/quiz/cbrn/aetzend.png';

export const CBRNQuestions: Question[] = [
	{
		answers: [
			{
				text: 'Gefahrgut sind Stoffe und Gegenstände, von denen auf Grund ihrer Natur, ihrer Eigenschaften oder ihres Zustandes im Zusammenhang mit der Beförderung Gefahren ausgehen können.',
				correct: true
			},
			{ text: 'Geld und wertvolle Antiquitäten.', correct: false },
			{ text: 'Getränke für die Einheiten.', correct: false }
		],
		number: 1,
		text: 'Was ist ein Gefahrgut?'
	},
	{
		answers: [
			{
				text: 'Gefahrstoffe sind Stoffe, Zubereitungen und Erzeugnisse, die bestimmte gefährliche Eigenschaften aufweisen oder von denen chemisch-physikalische Gefahren ausgehen.',
				correct: true
			},
			{
				text: 'Gefahrstoffe sind Stoffe die nur selten Helfer gefährlich werden können.',
				correct: false
			},
			{
				text: 'Gefahrstoffe sind Stoffe, für die ein Helfer keine Schutzbekleidung benötigt.',
				correct: false
			}
		],
		number: 2,
		text: 'Was sind Gefahrstoffe?'
	},
	{
		answers: [
			{
				text: 'Jede Helferin / jeder Helfer im THW.',
				correct: true
			},
			{
				text: 'Nur die Präsidentin / der Präsident des THW.',
				correct: false
			},
			{
				text: 'Nur der Auftraggeber.',
				correct: false
			}
		],
		number: 3,
		text: 'Wer kann für Vergehen im Umgang mit gefährlichen Stoffen und Gütern zur Verantwortung gezogen werden?'
	},
	{
		answers: [
			{
				text: 'Möglichst großen Abstand zum Unfallort halten, alle Zündquellen fernhalten (Motor abstellen, Rauchverbot, etc.) und die Strasse sichern (Warnschilder aufstellen), Straßenbenutzer sowie Anwohner warnen.',
				correct: true
			},
			{
				text: 'Verunfallte wenn möglich aus dem gefährlichen Bereich bringen (Schutzmaßnahmen unbedingt beachten – Eigenschutz!).',
				correct: true
			},
			{
				text: 'Es müssen keine Schutzmaßnahmen getroffen werden.',
				correct: false
			}
		],
		number: 4,
		text: 'Was ist bei einem Unfall mit gefährlichen Stoffen und Gütern zu beachten?'
	},
	{
		answers: [
			{
				text: 'Kennzeichnung an den Verpackungen.',
				correct: true
			},
			{
				text: 'Fahrzeugkennzeichnung, mitgeführte Fahrzeugpapiere und Merkblätter.',
				correct: true
			},
			{
				text: 'Durch Fahrerbefragung.',
				correct: false
			}
		],
		number: 5,
		text: 'Woran kann ich die Gefährdung, die von einem Gefahrguttransport ausgeht, eindeutig erkennen?'
	},
	{
		answers: [
			{ text: 'Explosive Stoffe', correct: false },
			{ text: 'Gase (nicht entzündbar)', correct: false },
			{ text: 'Entzündbare flüssige Stoffe', correct: false },
			{ text: 'Entzündend wirkende Stoffe', correct: false },
			{ text: 'Giftige Stoffe', correct: false },
			{ text: 'Ansteckungsgefährliche Stoffe', correct: false },
			{ text: 'Radioaktive Stoffe', correct: true },
			{ text: 'Ätzende Stoffe', correct: false }
		],
		number: 6,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: radioaktiv
	},
	{
		answers: [
			{ text: 'Explosive Stoffe', correct: false },
			{ text: 'Gase (nicht entzündbar)', correct: false },
			{ text: 'Entzündbare flüssige Stoffe', correct: false },
			{ text: 'Entzündend wirkende Stoffe', correct: false },
			{ text: 'Giftige Stoffe', correct: false },
			{ text: 'Ansteckungsgefährliche Stoffe', correct: false },
			{ text: 'Radioaktive Stoffe', correct: false },
			{ text: 'Ätzende Stoffe', correct: true }
		],
		number: 7,
		text: 'Ordne die folgenden Begriffe der Grafik zu:',
		image: aetzend
	}
];
