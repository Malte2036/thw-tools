<script lang="ts">
	import { QuestionType } from '$lib/model/question';
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';
	import { formatAccuracy, formatNumber, getQuizTypeName } from '$lib/quiz/quizUtils';

	interface Props {
		answeredCountData: AnsweredCountData | undefined;
		questionType: QuestionType;
	}

	let { answeredCountData, questionType }: Props = $props();

	let totalAnswered = $derived(
		answeredCountData ? answeredCountData.right + answeredCountData.wrong : 0
	);
	let correctPercentage = $derived(
		totalAnswered > 0 ? (answeredCountData!.right / totalAnswered) * 100 : 0
	);
</script>

<div class="rounded-2xl bg-white p-4 shadow-card ring-1 ring-thw-100/60">
	<div class="grid grid-cols-3 gap-4 text-center">
		<div class="flex flex-col">
			<span class="text-2xl font-bold tabular-nums text-thw-800">{formatNumber(totalAnswered)}</span
			>
			<span class="mt-0.5 text-xs font-medium text-gray-500">Fragen beantwortet</span>
		</div>

		<div class="flex flex-col">
			<span class="text-2xl font-bold tabular-nums text-correct-600">
				{formatNumber(answeredCountData?.right || 0)}
			</span>
			<span class="mt-0.5 text-xs font-medium text-gray-500">Richtig</span>
		</div>

		<div class="flex flex-col">
			<span class="text-2xl font-bold tabular-nums text-wrong-600">
				{formatNumber(answeredCountData?.wrong || 0)}
			</span>
			<span class="mt-0.5 text-xs font-medium text-gray-500">Falsch</span>
		</div>
	</div>

	<div class="mt-4">
		<div class="h-2 w-full overflow-hidden rounded-full bg-thw-100">
			<div
				class="h-full rounded-full bg-thw transition-all duration-500"
				style="width: {correctPercentage}%"
			></div>
		</div>
		<p class="mt-2 text-center text-xs text-gray-600">
			Durchschnittlich wurden {formatAccuracy(correctPercentage)} aller
			<span class="font-semibold text-thw-800">{getQuizTypeName(questionType)}</span> Fragen richtig
			beantwortet
		</p>
	</div>
</div>
