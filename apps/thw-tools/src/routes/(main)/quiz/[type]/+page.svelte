<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		const url = `/quiz/${data.questionType}/${data.questionNumber}`;
		console.log(`redirect to ${url}`);

		goto(url);
	});
</script>
