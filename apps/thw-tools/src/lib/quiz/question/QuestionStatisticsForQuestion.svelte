<script lang="ts">
	import type { QuestionType } from '$lib/model/question';
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';

	interface Props {
		currentQuestionAnsweredCountData: AnsweredCountData | undefined;
	}

	let { currentQuestionAnsweredCountData }: Props = $props();

	function getQuizTypeName(type: QuestionType) {
		switch (type) {
			case 'ga':
				return 'Grundausbildungs-Quiz';
			case 'agt':
				return 'Atemschutz-Quiz';
			case 'cbrn':
				return 'CBRN-Quiz';
			case 'radio':
				return 'Sprechfunk-Quiz';
			default:
				return 'Quiz';
		}
	}

	let currentTotal = $derived(currentQuestionAnsweredCountData
		? currentQuestionAnsweredCountData.right + currentQuestionAnsweredCountData.wrong
		: 0);
	let currentCorrectPercentage =
		$derived(currentTotal > 0
			? ((currentQuestionAnsweredCountData!.right / currentTotal) * 100).toFixed(1)
			: undefined);
</script>

<div class="flex flex-col gap-4">
	<div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
		<h3 class="text-lg font-medium text-gray-700 mb-2">Globale Statistik dieser Frage</h3>
		<div class="flex items-center gap-3">
			<div class="w-full bg-gray-200 rounded-full h-2.5">
				<div
					class="bg-thw h-2.5 rounded-full transition-all duration-500"
					style="width: {currentCorrectPercentage ?? 0}%"
				></div>
			</div>
			<span class="text-sm text-gray-600 whitespace-nowrap font-medium">
				<span class="inline-block min-w-[4ch] text-right">{currentCorrectPercentage ?? ''}</span>%
				richtig
			</span>
		</div>
		<p class="text-sm text-gray-500 mt-2">
			Diese Frage wurde insgesamt von allen Nutzern {currentTotal.toLocaleString('de-DE')} Mal beantwortet,
			davon {(currentQuestionAnsweredCountData?.right || 0).toLocaleString('de-DE')}
			Mal richtig
		</p>
	</div>
</div>
