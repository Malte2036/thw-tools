<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import { Button } from '@thw-tools/svelte-components';
	import Toggle from '$lib/Toggle.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';

	interface Props {
		onClose?: () => void;
	}

	let { onClose = () => {} }: Props = $props();
</script>

<Dialog title="Quiz Einstellungen">
	{#snippet content()}
		<div  class="flex flex-col gap-4">
			<div class="text-sm text-gray-600">
				Hier kannst du einstellen, wie die Fragen angezeigt werden sollen.
			</div>
			<Toggle bind:checked={$shuffleQuiz} label="Fragen in zufälliger Reihenfolge anzeigen" />
		</div>
	{/snippet}
	{#snippet footer()}
		<div  class="flex flex-row justify-end w-full">
			<Button click={onClose}>Schließen</Button>
		</div>
	{/snippet}
</Dialog>
