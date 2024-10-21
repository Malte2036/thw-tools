<script lang="ts">
	import { getOrganisationUserByInternalId } from '$lib/shared/stores/userStore';
	import { dateToFriendlyString } from '$lib/utils';
	import {
		eventTypeToEmoji,
		type FunkItem,
		type FunkItemDeviceId,
		type FunkItemEvent
	} from '../api/funkModels';
	import InventarItemEventTypeBadge from './FunkItemEventTypeBadge.svelte';
	import { user } from '$lib/shared/stores/userStore';



	interface Props {
		event: FunkItemEvent;
		deviceId: FunkItemDeviceId;
		isSelected: boolean;
		item: FunkItem | undefined;
		secondary?: boolean;
	}

	let {
		event,
		deviceId,
		isSelected,
		item,
		secondary = false
	}: Props = $props();

	const eventUser = getOrganisationUserByInternalId($user, event.user);
</script>

<a
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
	class:secondary
	class:selectedItem={isSelected}
	href={`/device/${deviceId}`}
>
	<div class="text-2xl">{eventTypeToEmoji(event.type)}</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap">ID: <span class="font-bold">{deviceId}</span></div>
			<div class="flex gap-1">
				<InventarItemEventTypeBadge type={event.type} />
				{#if item && item.name}
					<div class="rounded-xl text-sm px-2 h-min bg-slate-200 whitespace-nowrap">
						{item.name}
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-row gap-2 items-center w-full">
			<div class="text-sm text-nowrap text-gray-500">
				<span class="italic">
					{#if eventUser}
						{eventUser.firstName ?? ''}
						{eventUser.lastName ?? ''}
					{/if}
				</span>
				{' am '}
				<span>
					{dateToFriendlyString(new Date(event.date))}
				</span>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	.selectedItem {
		@apply bg-thw-300;
	}

	.secondary {
		@apply border-dashed border-thw-300;
	}
</style>
