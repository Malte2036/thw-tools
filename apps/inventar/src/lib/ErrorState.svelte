<script lang="ts">
	import { HttpError } from './api/error';

	export let label: string;
	export let error: Error | null = null;
</script>

<div class="flex flex-col justify-center h-full">
	<h1 class="text-xl font-bold">{label}</h1>
	{#if error}
		<p class="text-sm text-gray-500">
			{#if error instanceof HttpError && error.status}
				Statuscode: {error.status}
				{#if error.statusText}
					- {error.statusText}
				{/if}
			{:else if error.message}
				{error.message}
			{:else}
				Unbekannter Fehler
			{/if}
		</p>
	{/if}
</div>
