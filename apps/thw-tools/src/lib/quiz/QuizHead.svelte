<script lang="ts">
	import type { ExtendedQuestion, QuestionType } from '$lib/model/question';

	export let questionType: QuestionType;
	export let question: ExtendedQuestion | undefined;

	function getFriendlyType() {
		switch (questionType) {
			case 'ga':
				return 'Grundausbildungs-Quiz';
			case 'agt':
				return 'Atemschutz-Quiz';
			case 'cbrn':
				return 'CBRN-Quiz';
			default:
				return 'Quiz';
		}
	}

	function getTitle() {
		return `THW-Tools: ${getFriendlyType()}${question ? ` - Frage ${question.number}` : ''}`;
	}

	function getGenericDescription() {
		switch (questionType) {
			case 'ga':
				return 'Das Online-Theorie-Quiz für die Grundausbildung des THW bietet dir die Möglichkeit, dein Wissen über die Grundlagen des THW zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz des THW.';
			case 'agt':
				return 'Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten.';
			case 'cbrn':
				return 'Möchtest du dein Wissen über den sicheren Umgang mit CBRN-Gefahren verbessern? Dann ist unser Online-Theorie-Quiz für CBRN-Schutzkräfte des THW und der Feuerwehr genau das Richtige für dich. Teste dein Wissen und frische es auf, um im Einsatz von CBRN-Gefahren noch sicherer zu agieren.';
			default:
				return '';
		}
	}

	function getDescripton() {
		return question
			? `Frage ${question.number} vom ${getFriendlyType()}: ${question.text}: ${Array.from(
					question.answers.values()
				)
					.map((a) => a)
					.join(', ')}.`
			: getGenericDescription();
	}
</script>

<svelte:head>
	<title>{getTitle()}</title>
	<meta name="description" content={getDescripton()} />
	<meta property="og:title" content={getTitle()} />
	<meta property="og:description" content={getDescripton()} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp"
	/>
	<meta property="og:locale" content="de_DE" />
	<meta
		name="keywords"
		content="THW, Quiz, Online-Quiz, Theorie-Quiz, Grundausbildung, Atemschutz, CBRN, Gefahrenabwehr, Feuerwehr"
	/>
</svelte:head>
