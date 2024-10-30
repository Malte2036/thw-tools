<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import { inventarNummerRegex } from '../api/funkModels';

	interface Props {
		onScan: (decodedText: string) => void;
		showButtonText?: string;
		submitButtonText?: string;
	}

	let { 
		onScan,
		showButtonText = 'Gerät manuell hinzufügen',
		submitButtonText = 'Eintragen'
	}: Props = $props();

	let visible = $state(false);

	let inputValue = $state('');

	const HYPHEN_INDEX = 4;
	const HYPHEN = '-';

	const fixInputValue = (value: string) => {
		inputValue = value.trim();

		if (value.length > HYPHEN_INDEX && value[HYPHEN_INDEX] !== HYPHEN) {
			inputValue = value.slice(0, HYPHEN_INDEX) + HYPHEN + value.slice(HYPHEN_INDEX);
		}
	};
</script>

{#if visible}
	<div class="flex flex-row gap-4 w-full items-end">
		<Input
			bind:inputValue
			onInput={() => fixInputValue(inputValue)}
			placeholder="Inventarnummer"
			label="Inventarnummer des Gerätes"
			inputmode="numeric"
			pattern={inventarNummerRegex.source}
		/>
		<Button
			secondary
			click={() => {
				onScan(inputValue);
			}}
		>
			{submitButtonText}
		</Button>
	</div>
{:else}
	<Button secondary click={() => (visible = true)}>{showButtonText}</Button>
{/if}
