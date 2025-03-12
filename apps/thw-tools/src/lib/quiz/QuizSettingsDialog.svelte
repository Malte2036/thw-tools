<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Button from '$lib/Button.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';

	export let onClose: () => void = () => {};
</script>

<Dialog title="Quiz Einstellungen">
	<div slot="content" class="flex flex-col gap-4">
		<div class="text-sm text-gray-600">
			Hier kannst du einstellen, wie die Fragen angezeigt werden sollen.
		</div>
		<Toggle bind:checked={$shuffleQuiz} label="Fragen in zufälliger Reihenfolge anzeigen" />
	</div>
	<div slot="footer" class="flex flex-row justify-end w-full">
		<Button click={onClose}>Schließen</Button>
	</div>
</Dialog>
