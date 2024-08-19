<script lang="ts">
	import { dateToFriendlyString } from '$lib/utils';
	import {
		eventTypeToEmoji,
		eventTypeToFriendlyString,
		type InventarItem,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from './inventarItem';

	export let event: InventarItemEvent;
	export let deviceId: InventarItemDeviceId;
	export let isSelected: boolean;
	export let click: () => void;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
	class:selectedItem={isSelected}
	on:click={click}
>
	<div class="text-2xl">{eventTypeToEmoji(event.type)}</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap">ID: <span class="font-bold">{deviceId}</span></div>
			<div
				class="rounded-xl text-sm px-2 h-min bg-green-200"
				class:isBorrowed={event.type === 'borrowed'}
			>
				{eventTypeToFriendlyString(event.type)}
			</div>
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
	.isBorrowed {
		@apply bg-red-200;
	}
</style>
