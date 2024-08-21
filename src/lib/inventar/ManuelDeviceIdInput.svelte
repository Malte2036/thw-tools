<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	export let onScan: (decodedText: string) => void;

	let visible = false;

	let inputValue = '';
</script>

{#if visible}
	<div class="flex flex-row gap-4 w-full items-end">
		<Input bind:inputValue placeholder="Inventarnummer" label="Inventarnummer des Gerätes" />
		<Button
			secondary
			click={() => {
				onScan(inputValue);
			}}
		>
			Eintragen
		</Button>
	</div>
{:else}
	<Button secondary click={() => (visible = true)}>Gerät manuell hinzufügen</Button>
{/if}
