<script lang="ts">
	import { bulkCreateInventarItemEvents } from '$lib/api/inventarApi';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import ManuelDeviceIdInput from '$lib/inventar/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/inventar/QRScanner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import {
		batteryCountToFriendlyString,
		eventTypeToFriendlyString,
		validateInventarItemDeviceId,
		type InventarItem,
		type InventarItemDeviceId,
		type InventarItemEventType
	} from '../api/inventarItem';
	import InventarItemEventTypeBadge from './InventarItemEventTypeBadge.svelte';

	export let inventarItems: InventarItem[];
	export let reset: () => void;

	let scannedDeviceIds: {
		deviceId: InventarItemDeviceId;
		existingItem?: InventarItem;
	}[] = [];

	let batteryCountInput: string = '0';

	async function onScan(decodedText: string) {
		if (!decodedText) {
			return;
		}

		decodedText = decodedText.trim();

		if (!validateInventarItemDeviceId(decodedText)) {
			$bannerMessage = {
				message: `Ungültige Geräte-ID: ${decodedText}`,
				autoDismiss: {
					duration: 5 * 1000
				},
				type: 'error'
			};
			return;
		}

		$bannerMessage = {
			message: `Gerät mit der ID ${decodedText} gescannt.`,
			autoDismiss: {
				duration: 5 * 1000
			}
		};

		if (scannedDeviceIds.some((item) => item.deviceId === decodedText)) {
			return;
		}

		console.log(
			`Gerät mit der ID ${decodedText} gescannt.`,
			inventarItems.find((item) => item.deviceId === decodedText)
		);

		scannedDeviceIds = scannedDeviceIds.concat({
			deviceId: decodedText,
			existingItem: inventarItems.find((item) => item.deviceId === decodedText)
		});
	}

	async function submit(eventType: InventarItemEventType) {
		if (scannedDeviceIds.length == 0) {
			return;
		}

		const batteryCount = parseInt(batteryCountInput);

		await bulkCreateInventarItemEvents(
			scannedDeviceIds.map((e) => e.deviceId),
			batteryCount,
			eventType
		);

		$bannerMessage = {
			message: `${scannedDeviceIds.length} Gerät${
				scannedDeviceIds.length > 1 ? 'e' : ''
			} und ${batteryCountToFriendlyString(
				batteryCount
			)} wurden erfolgreich ${eventTypeToFriendlyString(eventType)}.`,
			autoDismiss: {
				duration: 5 * 1000
			}
		};

		scannedDeviceIds = [];
		reset();
	}
</script>

<div class="flex flex-col gap-2">
	<QrScanner {onScan} />
	<ManuelDeviceIdInput {onScan} />
</div>

{#if scannedDeviceIds.length > 0}
	<div class="font-bold text-2xl">Gescannte Geräte:</div>
	<div>
		{#each scannedDeviceIds as scannedDeviceId}
			<div class="flex gap-2 items-center">
				<div>{scannedDeviceId.deviceId}</div>
				{#if scannedDeviceId.existingItem}
					<InventarItemEventTypeBadge type={scannedDeviceId.existingItem.lastEvent.type} />
				{/if}
			</div>
		{/each}
	</div>

	<Input
		label="Batterien"
		type="number"
		placeholder="Anzahl Batterien"
		bind:inputValue={batteryCountInput}
		inputmode="numeric"
	/>

	<div class="flex gap-2 w-full justify-between">
		<Button
			secondary={scannedDeviceIds.every(
				(scannedDeviceId) => scannedDeviceId.existingItem?.lastEvent?.type === 'returned'
			)}
			click={() => submit('returned')}>Zurückgeben</Button
		>
		<Button
			secondary={scannedDeviceIds.every(
				(scannedDeviceId) => scannedDeviceId.existingItem?.lastEvent?.type === 'borrowed'
			)}
			click={() => submit('borrowed')}>Ausleihen</Button
		>
	</div>
{/if}
