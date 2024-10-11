<script lang="ts">
	import { dateToFriendlyString } from '$lib/utils';
	import {
		eventTypeToEmoji,
		type InventarItem,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from '../api/inventarItem';
	import InventarItemEventTypeBadge from './InventarItemEventTypeBadge.svelte';

	export let event: InventarItemEvent;
	export let deviceId: InventarItemDeviceId;
	export let isSelected: boolean;
	export let click: () => void;

	export let item: InventarItem | undefined;

	export let secondary: boolean = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
	class:secondary
	class:selectedItem={isSelected}
	on:click={click}
>
	<div class="text-2xl">{eventTypeToEmoji(event.type)}</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap">ID: <span class="font-bold">{deviceId}</span></div>
			<InventarItemEventTypeBadge type={event.type} />
			{#if item && item.name}
				<div class="rounded-xl text-sm px-2 h-min bg-slate-200 whitespace-nowrap">
					{item.name}
				</div>
			{/if}
		</div>
		<div class="flex flex-row gap-2 items-center w-full">
			<div class="text-sm text-nowrap text-gray-500">
				<span class="italic">
					{event.user.firstName ?? ''}
					{event.user.lastName ?? ''}
				</span>
				{' am '}
				<span>
					{dateToFriendlyString(new Date(event.date))}
				</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.selectedItem {
		@apply bg-thw-300;
	}

	.secondary {
		@apply border-dashed border-thw-300;
	}
</style>
