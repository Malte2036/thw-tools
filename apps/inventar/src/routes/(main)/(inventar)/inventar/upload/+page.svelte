<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { uploadInventoryTHWInExportFile } from '$lib/api/inventoryApi';
	import type { ImportInventoryItemsResult } from '$lib/api/inventoryModels';
	import Button from '$lib/Button.svelte';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let uploadPromise: Promise<void> | null = $state(null);
	let currentFileIndex: number = $state(0);
	let files: FileList | null = $state(null);
	let results: ImportInventoryItemsResult[] = $state([]);

	const importFiles = async () => {
		if (!files || files.length === 0) {
			console.error('No files selected');
			return;
		}

		results = [];
		currentFileIndex = 0;

		uploadPromise = (async () => {
			for (let i = 0; i < files.length; i++) {
				currentFileIndex = i;
				const file = files[i];
				const result = await uploadInventoryTHWInExportFile(file);
				results.push(result);
			}

			const totalCount = results.reduce((sum, result) => sum + result.count, 0);
			const allEinheiten = [...new Set(results.flatMap((r) => r.einheiten))];

			$bannerMessage = {
				message: `Es wurden ${totalCount} Inventar-Items der Einheiten ${allEinheiten
					.map((einheit) => `'${einheit}'`)
					.join(', ')} importiert`,
				type: 'info',
				autoDismiss: {
					duration: 5000
				}
			};

			uploadPromise = null;
			files = null;
			results = [];
			currentFileIndex = 0;

			await invalidateAll();
			goto('/inventar');
		})();
	};
</script>

<div class="p-2 flex flex-col gap-2">
	<LinkButton url="../" secondary>Zurück zur Inventar-Übersicht</LinkButton>
	<h1 class="text-2xl font-bold">Inventar Import</h1>
	<div>
		Hier können THWin Exporte hochgeladen werden. Die Exporte werden dann in das Inventar-System
		importiert. Alle Einheiten die in den THWin Exporten enthalten sind, werden in der Datenbank
		überschrieben.
	</div>

	{#if !uploadPromise}
		<div>
			<p class="text-lg font-bold">Bitte wähle Dateien aus:</p>
		</div>
		<input bind:files type="file" accept=".csv" multiple />
		{#if files}
			<Button click={importFiles}>Upload ({files.length} Dateien)</Button>
		{/if}
	{:else}
		{#await uploadPromise}
			<LoadingSpinner />
			<div>
				Verarbeite Datei {currentFileIndex + 1} von {files?.length}
			</div>
		{:catch error}
			<ErrorDisplay
				label="Beim Upload oder verarbeiten eines THWin Exports ist ein Fehler aufgetreten"
				{error}
			/>
		{/await}
	{/if}
</div>
