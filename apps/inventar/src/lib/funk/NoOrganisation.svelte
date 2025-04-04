<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createOrganisation } from '$lib/api/organisationApi';
	import { Button, Dialog, Input } from '@thw-tools/svelte-components';
	import Card from '$lib/Card.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let name: string = $state('');
	let error: string | null = $state(null);
	let showConfirmDialog: boolean = $state(false);

	const handleCreateClick = () => {
		error = null;

		if (!name) {
			error = 'Bitte gib einen Namen für die Organisation ein.';
			return;
		}

		showConfirmDialog = true;
	};

	const createOrg = async () => {
		await createOrganisation(name);
		showConfirmDialog = false;

		bannerMessage.set({
			message: 'Organisation erstellt!',
			type: 'info',
			autoDismiss: {
				duration: 5000
			}
		});
		invalidateAll();
	};
</script>

<div class="flex flex-col gap-6 p-4">
	<Card title="Organisation">
		<div class="flex flex-col gap-4">
			<div class="text-gray-600">
				Du bist in keiner Organisation. Falls für dein OV noch keine Organisation angelegt wurde,
				kannst du diese hier erstellen.
			</div>
			<div class="text-gray-600">
				Ansonsten kannst du dich per Einladungslink in eine bestehende
				<span class="font-bold">Organisation einladen</span>. Wende dich dafür einfach an eine
				Person die bereits Mitglied der Organisation ist.
			</div>
		</div>
	</Card>

	<Card title="Neue Organisation erstellen">
		<div class="flex flex-col gap-4">
			<Input
				bind:inputValue={name}
				label="Name der Organisation"
				placeholder="Meine Organisation"
			/>
			<Button click={handleCreateClick}>Erstellen</Button>

			{#if error}
				<div class="text-red-500">{error}</div>
			{/if}
		</div>
	</Card>
</div>

{#if showConfirmDialog}
	<Dialog title="Organisation erstellen">
		{#snippet content()}
			<div class="flex flex-col gap-4">
				<div>
					Bist du sicher, dass du eine neue Organisation mit dem Namen <span class="font-bold"
					>{name}</span
				> erstellen möchtest?
			</div>
			<div class="text-gray-600">
				Falls du einer bereits bestehenden Organisation beitreten möchtest, benötigst du nur einen
				Einladungslink zu dieser Organisation.
			</div>
		</div>
		{/snippet}
		{#snippet footer()}
			<div class="flex gap-4">
				<Button secondary click={() => (showConfirmDialog = false)}>Abbrechen</Button>
				<Button click={createOrg}>Organisation erstellen</Button>
			</div>
		{/snippet}
</Dialog>
{/if}
