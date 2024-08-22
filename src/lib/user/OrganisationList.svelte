<script lang="ts">
	import type { Organisation } from '$lib/api/organisationApi';

	export let organisations: Organisation[];
</script>

{#each organisations as org}
	<div
		class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
	>
		{org.name}
	</div>
{/each}
