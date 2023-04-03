<script lang="ts">
	import type { QuestionType } from './question/Question';

	export let questionType: QuestionType;
</script>

<svelte:head>
	{#if questionType == 'agt'}
		<title>Atemschutz-Quiz</title>
		<meta
			name="description"
			content="Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten."
		/>
	{:else}
		<title>CBRN-Quiz</title>
		<meta
			name="description"
			content="Möchtest du dein Wissen über den sicheren Umgang mit CBRN-Gefahren verbessern? Dann ist unser Online-Theorie-Quiz für CBRN-Schutzkräfte des THW und der Feuerwehr genau das Richtige für dich. Teste dein Wissen und frische es auf, um im Einsatz von CBRN-Gefahren noch sicherer zu agieren."
		/>
	{/if}
</svelte:head>
