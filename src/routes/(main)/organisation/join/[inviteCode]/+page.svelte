<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<div class="flex flex-col gap-4 p-4">
	{#if data.error}
		<div>
			Das hat nicht geklappt. Der Einladungscode ist ungültig oder du bist bereits in einer
			Organisation.
		</div>
	{/if}

	{#if data.organisation}
		<div class="flex flex-col gap-2">
			<div>
				Du bist erfolgreich der Organisation "<span class="font-bold">{data.organisation.name}</span
				>" mit <span class="font-bold">{data.organisation.members.length} Mitgliedern</span>
				beigetreten.
			</div>
			<LinkButton url={`/inventar?tab=Organisation`}>Zur Inventarliste</LinkButton>
		</div>
	{/if}
</div>
