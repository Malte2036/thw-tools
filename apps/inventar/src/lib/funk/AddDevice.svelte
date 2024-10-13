<script lang="ts">
	import { bulkCreateFunkItemEvents } from '$lib/api/funkApi';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import {
		batteryCountToFriendlyString,
		eventTypeToFriendlyString,
		validateFunkItemDeviceId,
		type FunkItem,
		type FunkItemDeviceId,
		type FunkItemEventType
	} from '../api/funkModels';
	import InventarItemEventTypeBadge from './FunkItemEventTypeBadge.svelte';

	export let items: FunkItem[];
	export let reset: () => void;

	let scannedDeviceIds: {
		deviceId: FunkItemDeviceId;
		existingItem?: FunkItem;
	}[] = [];

	let batteryCountInput: string = '0';

	async function onScan(decodedText: string) {
		if (!decodedText) {
			return;
		}

		decodedText = decodedText.trim();

		if (!validateFunkItemDeviceId(decodedText)) {
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
			items.find((item) => item.deviceId === decodedText)
		);

		scannedDeviceIds = scannedDeviceIds.concat({
			deviceId: decodedText,
			existingItem: items.find((item) => item.deviceId === decodedText)
		});
	}

	async function submit(eventType: FunkItemEventType) {
		if (scannedDeviceIds.length == 0) {
			return;
		}

		const batteryCount = parseInt(batteryCountInput);

		await bulkCreateFunkItemEvents(
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
