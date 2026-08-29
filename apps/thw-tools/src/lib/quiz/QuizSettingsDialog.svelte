<script lang="ts">
	import { Dialog } from '@thw-tools/svelte-components';
	import Toggle from '$lib/Toggle.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';

	interface Props {
		onClose?: () => void;
	}

	let { onClose = () => {} }: Props = $props();
</script>

<Dialog title="Quiz Einstellungen" variant="sheet" {onClose}>
	{#snippet content()}
		<div class="flex flex-col gap-4">
			<p class="text-sm text-gray-600">
				Hier kannst du einstellen, wie die Fragen angezeigt werden sollen.
			</p>
			<div class="rounded-2xl bg-thw-50 px-4 py-4">
				<Toggle bind:checked={$shuffleQuiz} label="Fragen in zufälliger Reihenfolge anzeigen" />
			</div>
		</div>
	{/snippet}
</Dialog>
