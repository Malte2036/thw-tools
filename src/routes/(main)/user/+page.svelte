<script lang="ts">
	import JoinOrCreateOrganisation from '$lib/user/JoinOrCreateOrganisation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-2">
	{#if !data.organisation}
		<JoinOrCreateOrganisation />
	{:else}
		<div class="text-2xl">Organisation: {data.organisation.name}</div>
	{/if}
</div>
