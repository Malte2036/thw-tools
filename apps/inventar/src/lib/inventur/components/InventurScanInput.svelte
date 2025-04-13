<script lang="ts">
	import QRScanner from '$lib/funk/QRScanner.svelte';
	import { ErrorMessage, LoadingSpinner } from '@thw-tools/svelte-components';

	interface Props {
		onScan: (decodedText: string) => Promise<void>; // Callback for handling scan
		isLoading: boolean;
		error: string | null;
	}

	let { onScan, isLoading, error }: Props = $props();
</script>

<QRScanner {onScan} />
{#if isLoading}
	<div class="flex items-center justify-center gap-2 mt-2">
		<LoadingSpinner /> Verarbeite Scan...
	</div>
{/if}
{#if error}
	<ErrorMessage message={error} />
{/if}
