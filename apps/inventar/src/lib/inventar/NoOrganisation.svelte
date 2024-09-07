<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createOrganisation } from '$lib/api/organisationApi';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let name: string = '';
	let error: string | null = null;

	const createOrg = async () => {
		error = null;

		if (!name) {
			error = 'Bitte gib einen Namen für die Organisation ein.';
			return;
		}

		await createOrganisation(name);

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

<div class="flex flex-col gap-16 p-4">
	<div class="flex flex-col gap-4">
		<div class="text-center text-2xl font-bold">Du bist in keiner Organisation.</div>
		<div class="text-center text-lg">
			Lass dich per Einladungslink in eine bestehende <span class="font-bold"
				>Organisation einladen</span
			> oder erstelle eine neue Organisation.
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<h1 class="text-center text-2xl font-bold">Neue Organisation erstellen:</h1>
		<Input bind:inputValue={name} label="Name der Organisation" placeholder="Meine Organisation" />
		<Button click={createOrg}>Erstellen</Button>

		{#if error}
			<div class="text-red-500">{error}</div>
		{/if}
	</div>
</div>
