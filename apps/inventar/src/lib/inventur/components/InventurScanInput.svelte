<script lang="ts">
	import { LoadingSpinner, ErrorMessage } from '@thw-tools/svelte-components';
	import QRScanner from '$lib/funk/QRScanner.svelte';

	interface Props {
		onScan: (decodedText: string) => Promise<void>;
	}

	let { onScan }: Props = $props();

	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function handleScanResult(decodedText: string) {
		if (isLoading) return;

		isLoading = true;
		error = null;
		try {
			await onScan(decodedText);
		} catch (err: any) {
			console.error('Scan processing error (InventurScanInput):', err);
			error =
				err.response?.data?.message || err.message || 'Fehler bei der Verarbeitung des Scans.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col gap-4">
	<QRScanner onScan={handleScanResult} />

	{#if isLoading}
		<div class="flex items-center justify-center gap-2 mt-2">
			<LoadingSpinner /> Verarbeite...
		</div>
	{/if}

	{#if error}
		<ErrorMessage message={error} />
	{/if}
</div>
