<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Table from '$lib/Table.svelte';
	import { createInventarItem, createInventarItemEvent } from '$lib/api/inventarApi';
	import InventarItemEventsList from '$lib/inventar/InventarItemEventsList.svelte';
	import ManuelDeviceIdInput from '$lib/inventar/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/inventar/QRScanner.svelte';
	import ScanInventarItemResultDialog from '$lib/inventar/ScanInventarItemResultDialog.svelte';
	import {
		eventTypeToEmoji,
		eventTypeToFriendlyString,
		type InventarItemDeviceId,
		type InventarItemEventType
	} from '$lib/inventar/inventarItem';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';
	import { dateToFriendlyString } from '$lib/utils';

	export let data: PageData;

	let scannedDeviceId:
		| {
				deviceId: string;
				alreadExists: boolean;
		  }
		| undefined;

	async function onScan(decodedText: string) {
		if (!decodedText) {
			return;
		}

		decodedText = decodedText.trim();

		scannedDeviceId = {
			deviceId: decodedText,
			alreadExists: data.inventarItems.some((item) => item.deviceId === decodedText)
		};
	}

	async function submit(eventType: InventarItemEventType) {
		if (!scannedDeviceId) {
			return;
		}

		if (scannedDeviceId.alreadExists) {
			console.log(`InventarItem ${scannedDeviceId.deviceId} already exists. Updating...`);

			await createInventarItemEvent(scannedDeviceId.deviceId, eventType);
			$bannerMessage = {
				message: `Das Gerät mit der ID ${scannedDeviceId.deviceId} wurde erfolgreich ${eventTypeToFriendlyString(
					eventType
				)}.`,
				autoDismiss: {
					duration: 5 * 1000
				}
			};
		} else {
			console.log(`InventarItem ${scannedDeviceId.deviceId} does not exist. Creating...`);

			await createInventarItem(scannedDeviceId.deviceId, eventType);
			$bannerMessage = {
				message: `Das Gerät mit der ID ${scannedDeviceId.deviceId} wurde erfolgreich angelegt und als ${eventTypeToFriendlyString(
					eventType
				)} markiert.`,
				autoDismiss: {
					duration: 5 * 1000
				}
			};
		}

		scannedDeviceId = undefined;
		selectedDeviceId = undefined;
		invalidateAll();
	}

	let selectedDeviceId: InventarItemDeviceId | undefined;
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex flex-col gap-2">
		<QrScanner {onScan} />
		<ManuelDeviceIdInput {onScan} />
	</div>

	<div class="flex flex-col gap-2">
		<div class="font-bold text-2xl">Inventarliste:</div>
		<div class="flex flex-col gap-2">
			{#if data.inventarItems.length === 0}
				<p>Keine Geräte vorhanden.</p>
			{/if}
			{#each data.inventarItems as item}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-scroll"
					class:selectedItem={item.deviceId === selectedDeviceId}
					on:click={() =>
						(selectedDeviceId = item.deviceId === selectedDeviceId ? undefined : item.deviceId)}
				>
					<div class="text-2xl">{eventTypeToEmoji(item.lastEvent.type)}</div>
					<div class="flex flex-col gap-0 w-full">
						<div class="flex flex-row gap-2 justify-between w-full">
							<div class="text-nowrap">ID: <span class="font-bold">{item.deviceId}</span></div>
							<div
								class="rounded-2xl text-sm px-2 py-1 h-min bg-green-200"
								class:isBorrowed={item.lastEvent.type === 'borrowed'}
							>
								{eventTypeToFriendlyString(item.lastEvent.type)}
							</div>
						</div>
						<div class="flex flex-row gap-2 items-center w-full">
							<div class="text-sm text-nowrap text-gray-500">
								<span class="italic">
									{item.lastEvent.user.firstName ?? ''}
									{item.lastEvent.user.lastName ?? ''}
								</span>
								{' am '}
								<span>
									{dateToFriendlyString(new Date(item.lastEvent.date))}
								</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

{#if selectedDeviceId}
	<InventarItemEventsList deviceId={selectedDeviceId} scrollIntoViewOnDataChange={true} />
{/if}

{#if scannedDeviceId}
	<ScanInventarItemResultDialog
		deviceId={scannedDeviceId.deviceId}
		lastEvent={data.inventarItems.find((item) => item.deviceId === scannedDeviceId?.deviceId)
			?.lastEvent}
		onSubmit={submit}
	/>
{/if}

<style lang="scss">
	.selectedItem {
		@apply bg-thw-300;
	}
	.isBorrowed {
		@apply bg-red-200;
	}
</style>
