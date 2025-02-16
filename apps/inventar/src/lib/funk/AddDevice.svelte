<script lang="ts">
	import { bulkCreateFunkItemEvents } from '$lib/api/funkApi';
	import Button from '$lib/Button.svelte';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import Input from '$lib/Input.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import {
		funk,
		getFunkItemByDeviceId,
		getLastFunkItemEventByFunkItemInternalId
	} from '$lib/shared/stores/funkStore';
	import { playScanSound } from '$lib/sound/sound';
	import {
		batteryCountToFriendlyString,
		eventTypeToFriendlyString,
		FunkItemDeviceIdSchema,
		type FunkItemDeviceId,
		type FunkItemEvent,
		type FunkItemEventType
	} from '../api/funkModels';
	import InventarItemEventTypeBadge from './FunkItemEventTypeBadge.svelte';

	interface Props {
		reset: () => void;
	}

	let { reset }: Props = $props();

	let scannedDeviceIds: {
		deviceId: FunkItemDeviceId;
		lastEvent?: FunkItemEvent;
	}[] = $state([]);

	let batteryCountInput: string = $state('0');

	function onScan(decodedText: string, isQrScan: boolean = false) {
		if (!decodedText) {
			return;
		}

		const parsed = FunkItemDeviceIdSchema.safeParse(decodedText.trim());

		if (!parsed.success) {
			$bannerMessage = {
				message: `Ungültige Geräte-ID: ${decodedText}`,
				autoDismiss: {
					duration: 5 * 1000
				},
				type: 'error'
			};
			return;
		}

		if (scannedDeviceIds.some((item) => item.deviceId === decodedText)) {
			return;
		}

		const existingItem = getFunkItemByDeviceId($funk, parsed.data);
		const lastEvent =
			existingItem && getLastFunkItemEventByFunkItemInternalId($funk, existingItem.id);

		scannedDeviceIds = scannedDeviceIds.concat({
			deviceId: parsed.data,
			lastEvent
		});

		if (isQrScan) {
			playScanSound();
		}

		$bannerMessage = {
			message: `Gerät mit der ID ${parsed.data} gescannt.`,
			autoDismiss: {
				duration: 5 * 1000
			}
		};
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
	<QrScanner onScan={(text) => onScan(text, true)} />
	<ManuelDeviceIdInput {onScan} />
</div>

{#if scannedDeviceIds.length > 0}
	<div class="font-bold text-2xl">Gescannte Geräte:</div>
	<div>
		{#each scannedDeviceIds as scannedDeviceId}
			<div class="flex gap-2 items-center">
				<div>{scannedDeviceId.deviceId}</div>
				{#if scannedDeviceId.lastEvent}
					<InventarItemEventTypeBadge type={scannedDeviceId.lastEvent.event.type} />
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
				(scannedDeviceId) => scannedDeviceId.lastEvent?.event.type === 'returned'
			)}
			click={() => submit('returned')}>Zurückgeben</Button
		>
		<Button
			secondary={scannedDeviceIds.every(
				(scannedDeviceId) => scannedDeviceId.lastEvent?.event.type === 'borrowed'
			)}
			click={() => submit('borrowed')}>Ausleihen</Button
		>
	</div>
{/if}
