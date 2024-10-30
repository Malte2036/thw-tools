<script lang="ts">
	import { QuestionType } from '$lib/model/question';
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';

	export let answeredCountData: AnsweredCountData | undefined;
	export let questionType: QuestionType;

	$: totalAnswered = answeredCountData ? answeredCountData.right + answeredCountData.wrong : 0;
	$: correctPercentage =
		totalAnswered > 0 ? ((answeredCountData!.right / totalAnswered) * 100).toFixed(1) : 0;

	function getQuizTypeName(type: QuestionType) {
		switch (type) {
			case QuestionType.GA:
				return 'Grundausbildungs-Quiz';
			case QuestionType.AGT:
				return 'Atemschutz-Quiz';
			case QuestionType.CBRN:
				return 'CBRN-Quiz';
			case QuestionType.RADIO:
				return 'Sprechfunk-Quiz';
			default:
				return 'Quiz';
		}
	}
</script>

<div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
	<div class="grid grid-cols-3 gap-4 text-center">
		<div class="flex flex-col">
			<span class="text-2xl font-bold text-gray-700">
				{totalAnswered.toLocaleString('de-DE')}
			</span>
			<span class="text-sm text-gray-500">Fragen beantwortet</span>
		</div>

		<div class="flex flex-col">
			<span class="text-2xl font-bold text-green-600">
				{(answeredCountData?.right || 0).toLocaleString('de-DE')}
			</span>
			<span class="text-sm text-gray-500">Richtig</span>
		</div>

		<div class="flex flex-col">
			<span class="text-2xl font-bold text-red-600">
				{(answeredCountData?.wrong || 0).toLocaleString('de-DE')}
			</span>
			<span class="text-sm text-gray-500">Falsch</span>
		</div>
	</div>

	<div class="mt-3">
		<div class="w-full bg-gray-200 rounded-full h-2.5">
			<div
				class="bg-thw h-2.5 rounded-full transition-all duration-500"
				style="width: {correctPercentage}%"
			/>
		</div>
		<p class="text-center text-sm text-gray-600 mt-1">
			Durchschnittlich wurden {correctPercentage}% aller
			<span class="font-medium">{getQuizTypeName(questionType)}</span> Fragen richtig beantwortet
		</p>
	</div>
</div>
