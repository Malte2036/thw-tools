<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<h1>Stats for {data.questionType}</h1>

	<div>Today:</div>

	<ul>
		<li>
			{data.statsToday.right} right
		</li>
		<li>
			{data.statsToday.wrong} wrong
		</li>
	</ul>
</main>
