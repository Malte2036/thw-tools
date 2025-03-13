<script lang="ts">
	import type { ExtendedQuestion, QuestionType } from '$lib/model/question';
	import { version } from '$app/environment';

	interface Props {
		questionType: QuestionType;
		question: ExtendedQuestion | undefined;
	}

	let { questionType, question }: Props = $props();

	function getFriendlyType() {
		switch (questionType) {
			case 'ga':
				return 'Grundausbildungs-Quiz – THW Prüfungsfragen';
			case 'agt':
				return 'Atemschutz-Quiz – THW Prüfungsfragen';
			case 'cbrn':
				return 'CBRN-Quiz – THW Prüfungsfragen';
			case 'radio':
				return 'Sprechfunk-Quiz – THW Prüfungsfragen';
			default:
				return 'THW Prüfungsfragen – Quiz';
		}
	}

	function getTitle() {
		// Beispiel: "THW-Tools: Grundausbildungs-Quiz – THW Prüfungsfragen - Frage 12"
		return `THW-Tools: ${getFriendlyType()}${question ? ' – Frage ' + question.number : ''}`;
	}

	function getGenericDescription() {
		switch (questionType) {
			case 'ga':
				return 'THW-Prüfungsfragen für die Grundausbildung: Teste dein Wissen online und bereite dich optimal auf die THW-Prüfung vor.';
			case 'agt':
				return 'THW-Prüfungsfragen für Atemschutzgeräteträger (AGT): Lerne sicher mit Atemschutzgeräten umzugehen und bestehe deine Prüfung.';
			case 'cbrn':
				return 'THW-Prüfungsfragen zum CBRN-Schutz: Vertiefe dein Wissen im Umgang mit CBRN-Gefahren und prüfe deinen Kenntnisstand.';
			case 'radio':
				return 'THW-Prüfungsfragen zum Sprechfunk: Trainiere den richtigen Umgang mit Funkgeräten und bereite dich perfekt vor.';
			default:
				return 'Inoffizielle THW-Prüfungsfragen: Teste und verbessere dein Wissen in verschiedenen Themenbereichen des THW.';
		}
	}

	function getDescription() {
		if (question) {
			return `THW Prüfungsfragen – ${getFriendlyType()}, Frage ${question.number}: ${
				question.text
			}. Antworten: ${Array.from(
				question.answers.map((a, index) => `${index + 1}: ${a.text}`).values()
			).join(', ')}.`;
		} else {
			return getGenericDescription();
		}
	}

	let jsonLd = $derived(question
		? {
				'@context': 'https://schema.org',
				'@type': 'QAPage',
				name: getTitle(),
				description: getDescription(),
				inLanguage: 'de',
				dateModified: new Date(+version).toISOString(),
				mainEntity: {
					'@type': 'Question',
					name: question.text,
					text: question.text,
					dateCreated: new Date(+version).toISOString(),
					answerCount: question.answers.length,
					suggestedAnswer: question.answers.map((answer, index) => ({
						'@type': 'Answer',
						text: answer.text
					})),
					author: {
						'@type': 'Organization',
						name: 'THW-Tools'
					}
				},
				publisher: {
					'@type': 'Organization',
					name: 'THW-Tools',
					url: 'https://thw-tools.de',
					logo: {
						'@type': 'ImageObject',
						url: 'https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp',
						width: '512',
						height: '512'
					}
				}
			}
		: undefined);
</script>

<svelte:head>
	<title>{getTitle()}</title>

	<!-- Meta Description -->
	<meta name="description" content={getDescription()} />

	<!-- Open Graph Tags -->
	<meta property="og:title" content={getTitle()} />
	<meta property="og:description" content={getDescription()} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp"
	/>
	<meta property="og:locale" content="de_DE" />

	<!-- Keywords -->
	<meta
		name="keywords"
		content="THW, THW Prüfungsfragen, Grundausbildung, Atemschutz, CBRN, Sprechfunk, Online-Quiz, Theorie-Quiz, Prüfung, THW-Tools, Feuerwehr, Ausbildung, Training"
	/>
	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>
