<script lang="ts">
	import { QuestionType } from '$lib/model/question';
	import { getQuestionStatsCountForType, getQuestionCount } from '$lib/api/api';
	import { formatNumber, getQuizTypeShortName, formatAccuracy } from '$lib/quiz/quizUtils';
	import { onMount } from 'svelte';

	type CategorySummary = {
		type: QuestionType;
		totalQuestions: number;
		correctCount: number;
		incorrectCount: number;
		accuracy: number;
	};

	let categoryStats: CategorySummary[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	async function loadCategoryStats() {
		try {
			const summaries = await Promise.all(
				Object.values(QuestionType).map(async (type) => {
					const stats = await getQuestionStatsCountForType(type);
					const totalQuestions = await getQuestionCount(type);
					const totalAttempts = stats.right + stats.wrong;

					return {
						type,
						totalQuestions,
						correctCount: stats.right,
						incorrectCount: stats.wrong,
						accuracy: totalAttempts > 0 ? (stats.right / totalAttempts) * 100 : 0
					};
				})
			);

			categoryStats = summaries;
		} catch (e) {
			error = 'Failed to load statistics';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadCategoryStats();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Quiz-Statistiken</h1>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
			<p>{error}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Overall Summary -->
			<div class="bg-white p-6 rounded-lg shadow-lg col-span-full">
				<h2 class="text-xl font-semibold mb-4">Gesamtübersicht</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					{#if categoryStats.length > 0}
						{@const totalAttempts = categoryStats.reduce(
							(sum, cat) => sum + cat.correctCount + cat.incorrectCount,
							0
						)}
						{@const totalCorrect = categoryStats.reduce((sum, cat) => sum + cat.correctCount, 0)}
						{@const totalQuestions = categoryStats.reduce(
							(sum, cat) => sum + cat.totalQuestions,
							0
						)}
						{@const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0}

						<div class="text-center p-4 bg-gray-50 rounded">
							<p class="text-gray-600 text-sm">Gesamtfragen</p>
							<p class="text-2xl font-bold">{formatNumber(totalQuestions)}</p>
						</div>
						<div class="text-center p-4 bg-gray-50 rounded">
							<p class="text-gray-600 text-sm">Beantwortete Fragen</p>
							<p class="text-2xl font-bold">{formatNumber(totalAttempts)}</p>
						</div>
						<div class="text-center p-4 bg-gray-50 rounded">
							<p class="text-gray-600 text-sm">Korrekte Antworten</p>
							<p class="text-2xl font-bold text-green-600">{formatNumber(totalCorrect)}</p>
						</div>
						<div class="text-center p-4 bg-gray-50 rounded">
							<p class="text-gray-600 text-sm">Erfolgsquote</p>
							<p class="text-2xl font-bold text-thw">{formatAccuracy(overallAccuracy)}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Category Cards -->
			{#each categoryStats as category}
				<div class="bg-white p-6 rounded-lg shadow-lg">
					<h3 class="text-lg font-semibold mb-4">{getQuizTypeShortName(category.type)}</h3>
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Gesamtfragen:</span>
							<span class="font-semibold">{formatNumber(category.totalQuestions)}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Beantwortete Fragen:</span>
							<span class="font-semibold"
								>{formatNumber(category.correctCount + category.incorrectCount)}</span
							>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Korrekte Antworten:</span>
							<span class="font-semibold text-green-600">{formatNumber(category.correctCount)}</span
							>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Falsche Antworten:</span>
							<span class="font-semibold text-red-600">{formatNumber(category.incorrectCount)}</span
							>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-600">Erfolgsquote:</span>
							<span class="font-semibold text-thw">{formatAccuracy(category.accuracy)}</span>
						</div>

						<!-- Progress Bar -->
						<div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
							<div class="bg-thw h-2.5 rounded-full" style="width: {category.accuracy}%"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
