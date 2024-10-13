<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import { inventarNummerRegex } from '../api/funkModels';

	export let onScan: (decodedText: string) => void;

	let visible = false;

	let inputValue = '';

	const HYPHEN_INDEX = 4;
	const HYPHEN = '-';
	const DEVICE_ID_LENGTH = 11;

	const fixInputValue = (value: string) => {
		inputValue = value.trimStart();

		if (value.length > HYPHEN_INDEX && value[HYPHEN_INDEX] !== HYPHEN) {
			console.log(
				'Adding hyphen to',
				value,
				value.slice(0, HYPHEN_INDEX),
				value.slice(HYPHEN_INDEX)
			);

			inputValue = value.slice(0, HYPHEN_INDEX) + HYPHEN + value.slice(HYPHEN_INDEX);
		}

		if (value.length > DEVICE_ID_LENGTH) {
			inputValue = value.slice(0, DEVICE_ID_LENGTH);
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
			Eintragen
		</Button>
	</div>
{:else}
	<Button secondary click={() => (visible = true)}>Gerät manuell hinzufügen</Button>
{/if}
