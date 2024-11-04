<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import ErrorState from '$lib/ErrorDisplay.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let showSuccessDialog = $state(true);

	function handleClose() {
		showSuccessDialog = false;
		window.location.href = '/';
	}
</script>

<div class="flex flex-col gap-4 p-4">
	{#await data.organisation}
		<LoadingSpinner />
	{:then organisation}
		{#if organisation}
			{#if showSuccessDialog}
				<Dialog title="Organisation beigetreten">
					<div slot="content" class="flex flex-col gap-2">
						<div>
							Du bist erfolgreich der Organisation "<span class="font-bold"
								>{organisation.name}</span
							>" mit <span class="font-bold">{organisation.members.length} Mitgliedern</span>
							beigetreten.
						</div>
					</div>
					<div slot="footer">
						<Button click={handleClose}>Zur Funkgeräteliste</Button>
					</div>
				</Dialog>
			{/if}
		{:else}
			<div class="flex flex-col gap-2">
				<div>
					Das hat nicht geklappt. Der Einladungscode ist entweder ungültig oder du bist bereits in
					einer Organisation.
				</div>
				<LinkButton url="/">Zur Funkgeräteliste</LinkButton>
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
