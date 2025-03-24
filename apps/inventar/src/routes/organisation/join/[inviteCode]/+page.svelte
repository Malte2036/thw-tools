<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Dialog } from '@thw-tools/svelte-components';
	import ErrorState from '$lib/ErrorDisplay.svelte';
	import { LinkButton } from '@thw-tools/svelte-components';
	import { LoadingSpinner } from '@thw-tools/svelte-components';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let showSuccessDialog = $state(true);

	function handleClose() {
		showSuccessDialog = false;

		goto('/', {
			invalidateAll: true,
			replaceState: true
		});
	}
</script>

<div class="flex flex-col gap-4 p-4">
	{#await data.organisation}
		<LoadingSpinner />
	{:then organisation}
		{#if organisation}
			{#if showSuccessDialog}
				<Dialog title="Organisation beigetreten">
					{#snippet content()}
						<div class="flex flex-col gap-2">
							<div>
								Du bist erfolgreich der Organisation "<span class="font-bold"
									>{organisation.name}</span
							>" mit <span class="font-bold">{organisation.members.length} Mitgliedern</span>
							beigetreten.
							</div>
						</div>
					{/snippet}
					{#snippet footer()}
						<div>
							<Button click={handleClose}>Zur Funkgeräteliste</Button>
						</div>
					{/snippet}
				</Dialog>
			{/if}
		{:else}
			<div class="flex flex-col gap-2">
				<div>
					Das hat nicht geklappt. Der Einladungscode ist entweder ungültig oder du bist bereits in
					einer Organisation.
				</div>
				<LinkButton url="/funk/">Zur Funkgeräteliste</LinkButton>
			</div>
		{/if}
	{:catch error}
		<ErrorState
			label="Beim Beitreten der Organisation ist leider ein Fehler aufgetreten."
			{error}
		/>
		<LinkButton url="/">Zurück zur Übersicht</LinkButton>
	{/await}
</div>
