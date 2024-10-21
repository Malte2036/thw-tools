<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { uploadInventoryTHWInExportFile } from '$lib/api/inventoryApi';
	import type { ImportInventoryItemsResult } from '$lib/api/inventoryModels';
	import Button from '$lib/Button.svelte';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let uploadPromise: Promise<ImportInventoryItemsResult> | null = $state(null);

	let files: FileList | null = $state(null);

	const importFile = async () => {
		const file = files?.[0];
		if (!file) {
			console.error('No file selected');

			return;
		}

		uploadPromise = uploadInventoryTHWInExportFile(file);

		const res = await uploadPromise;

		$bannerMessage = {
			message: `Es wurden ${res.count} Inventar-Items der Einheiten ${res.einheiten.map((einheit) => `'${einheit}'`).join(', ')} importiert`,
			type: 'info',
			autoDismiss: {
				duration: 5000
			}
		};

		uploadPromise = null;
		files = null;

		invalidateAll();
	};
</script>

<div class="p-2 flex flex-col gap-2">
	<LinkButton url="../" secondary>Zurück zur Inventar-Übersicht</LinkButton>
	<h1 class="text-2xl font-bold">Inventar Import</h1>
	<div>
		Hier kann der THWin Export hochgeladen werden. Der Export wird dann in das Inventar-System
		importiert. Alle Einheiten die im THWin Export enthalten sind, werden in der Datenbank
		überschrieben.
	</div>

	{#if !uploadPromise}
		<div>
			<p class="text-lg font-bold">Bitte wähle eine Datei aus:</p>
		</div>
		<input bind:files type="file" accept=".csv" />
		{#if files}
			<Button click={importFile}>Upload</Button>
		{/if}
	{:else}
		{#await uploadPromise}
			<LoadingSpinner />
		{:catch error}
			<ErrorDisplay
				label="Beim Upload oder verarbeiten des THWin Exports ist ein Fehler aufgetreten"
				{error}
			/>
		{/await}
	{/if}
</div>
