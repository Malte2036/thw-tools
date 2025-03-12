import type { PageLoad } from './$types';

interface FaqItem {
	question: string;
	text: string;
	links?: { href: string; text: string; title: string; external?: boolean }[];
}

export const load = (async () => {
	const faqs: FaqItem[] = [
		{
			question: 'Welche Prüfungs-Quizze gibt es?',
			text: 'THW-Tools bietet dir verschiedene Prüfungs-Quizze zur Vorbereitung: Das {{link}} für die GA-Prüfung, das {{link}} für AGT, das {{link}} und das {{link}}. Alle Quizze sind kostenlos und werden regelmäßig erweitert.',
			links: [
				{
					href: '/quiz/ga/listing/',
					text: 'Grundausbildungs-Quiz',
					title: 'Zum THW Grundausbildungs-Quiz'
				},
				{ href: '/quiz/agt/listing/', text: 'Atemschutz-Quiz', title: 'Zum THW Atemschutz-Quiz' },
				{ href: '/quiz/cbrn/listing/', text: 'CBRN-Quiz', title: 'Zum THW CBRN-Quiz' },
				{ href: '/quiz/radio/listing/', text: 'Sprechfunk-Quiz', title: 'Zum THW Sprechfunk-Quiz' }
			]
		},
		{
			question: 'Wie funktionieren die Quizze?',
			text: 'Wähle einfach ein Quiz aus und starte mit den Fragen. Du bekommst sofort Feedback, ob deine Antwort richtig war.'
		},
		{
			question: 'Woher kommen die Quiz-Fragen?',
			text: 'Die Fragen basieren auf offiziellen Quellen: Die {{link}} stammen vom THW (siehe {{link}}). Die {{link}} stammen vom THW (siehe {{link}} und {{link}}). Die {{link}} stammen von der Niedersächsischen Akademie für Brand- und Katastrophenschutz (siehe {{link}}). Die {{link}} stammen vom THW.',
			links: [
				{
					text: 'Grundausbildungs-Quiz Fragen',
					href: '/quiz/ga/listing/',
					title: 'Zum THW Grundausbildungs-Quiz'
				},
				{
					text: 'Fragenkatalog zur Grundausbildung',
					href: 'https://ov-woerth.thw.de/fileadmin/user_upload/LVBY/GSTR/OWOE/PDF/Fragenkatalog_zur_Grundausbildung.pdf',
					external: true,
					title: 'THW Fragenkatalog zur Grundausbildung'
				},
				{
					text: 'Sprechfunk-Quiz Fragen',
					href: '/quiz/radio/listing/',
					title: 'Zum THW Sprechfunk-Quiz'
				},
				{
					text: 'Prüfungsbogen A',
					href: 'https://ov-woerth.thw.de/fileadmin/user_upload/LVBY/GSTR/OWOE/Mediathek/Ausbildungsmaterial/Musterloesung_Sprechfunk_Satz_A.pdf',
					external: true,
					title: 'THW Sprechfunk Prüfungsbogen A'
				},
				{
					text: 'Prüfungsbogen B',
					href: 'https://ov-woerth.thw.de/fileadmin/user_upload/LVBY/GSTR/OWOE/Mediathek/Ausbildungsmaterial/Musterloesung_Sprechfunk_Satz_B.pdf',
					external: true,
					title: 'THW Sprechfunk Prüfungsbogen B'
				},
				{ text: 'AGT-Quiz Fragen', href: '/quiz/agt/listing/', title: 'Zum THW Atemschutz-Quiz' },
				{
					text: 'Fragenkatalog',
					href: 'https://www.nlbk.niedersachsen.de/startseite/service/download/ausbildung_nach_fwdv_2/kreisausbildung/lehrgang_atemschutzgeratetrager/downloadbereich-lehrgang-atemschutzgeraetetraeger-86208.html',
					external: true,
					title: 'NLBK Atemschutz Fragenkatalog'
				},
				{ text: 'CBRN-Quiz Fragen', href: '/quiz/cbrn/listing/', title: 'Zum THW CBRN-Quiz' }
			]
		},
		{
			question: 'Gibt es weitere Tools neben den Quizzen?',
			text: 'Ja! THW-Tools bietet auch den {{link}} für AGT, einen {{link}} für E-Lehrgänge, den {{link}} für die THW-Dienstbekleidung und weitere praktische Tools. Schau dich einfach um und gib mir Feedback, welche Tools du dir noch wünschst.',
			links: [
				{
					href: 'https://finnentest.thw-tools.de',
					text: 'Finnentest-Tracker',
					external: true,
					title: 'THW Finnentest-Tracker - Fitness für Atemschutzgeräteträger'
				},
				{
					href: 'https://elektro.thw-tools.de',
					text: 'Spannungsfall-Rechner',
					external: true,
					title: 'THW Spannungsfall-Rechner für E-Lehrgänge'
				},
				{
					href: '/clothing',
					text: 'Bekleidungsrechner',
					title: 'THW MEA Bekleidungsrechner - Größen berechnen'
				}
			]
		},
		{
			question: 'Wie funktioniert der MEA Bekleidungsrechner?',
			text: 'Mit dem {{link}} kannst du deine passende Größe für die neue THW MEA-Bekleidung berechnen. Gib einfach deine Körpermaße ein und der Rechner ermittelt die optimale Größe für jedes Kleidungsstück. Die Berechnung basiert auf der EN 13402 und wurde speziell für die THW MEA-Bekleidung optimiert.',
			links: [
				{
					href: '/clothing',
					text: 'Bekleidungsrechner',
					title: 'THW MEA Bekleidungsrechner - Größen berechnen'
				}
			]
		},
		{
			question: 'Kann ich die Tools auch offline nutzen?',
			text: 'Ja! Installiere THW-Tools einfach als App auf deinem Smartphone oder Computer. Klicke dazu auf "Als App installieren". Danach kannst du alle Funktionen auch ohne Internet nutzen - perfekt für unterwegs oder im Dienst.'
		},
		{
			question: 'Wie kann ich neue Fragen oder Verbesserungsvorschläge einbringen?',
			text: 'Ich freue mich über deine Vorschläge! Schreib mir einfach über Hermine (Malte Sehmer) oder nutze den Feedback-Button. Neue Fragen und Verbesserungsvorschläge helfen mir, THW-Tools noch besser zu machen.'
		}
	];

	return {
		faqs
	};
}) satisfies PageLoad;
