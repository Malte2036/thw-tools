<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex flex-col gap-2">
		{#if data.organisation}
			<div>
				Du bist erfolgreich der Organisation "<span class="font-bold">{data.organisation.name}</span
				>" mit <span class="font-bold">{data.organisation.members.length} Mitgliedern</span>
				beigetreten.
			</div>
		{:else}
			<div>
				Das hat nicht geklappt. Der Einladungscode ist entweder ungültig oder du bist bereits in
				einer Organisation.
			</div>
		{/if}
		<LinkButton url={`/?tab=Organisation`}>Zur Funkgeräteliste</LinkButton>
	</div>
</div>
