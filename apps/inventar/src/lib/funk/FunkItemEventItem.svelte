<script lang="ts">
	import { getOrganisationUserByInternalId } from '$lib/shared/stores/userStore';
	import { dateToFriendlyString } from '$lib/utils';
	import {
		eventTypeToEmoji,
		type FunkItem,
		type FunkItemDeviceId,
		type FunkItemEvent
	} from '../api/funkModels';
	import { user } from '$lib/shared/stores/userStore';
	import { eventTypeToFriendlyString } from '../api/funkModels';
	import { db } from '$lib/utils/db';

	interface Props {
		event: FunkItemEvent;
		deviceId: FunkItemDeviceId;
		isSelected: boolean;
		item: FunkItem | undefined;
		secondary?: boolean;
	}

	let { event, deviceId, isSelected, item, secondary = false }: Props = $props();

	const eventUser = getOrganisationUserByInternalId($user, event.user);

	let itemType: string | undefined = $state(undefined);

	$effect(() => {
		if (!item?.deviceId) return;

		db.getInventoryItemByInventarNummer(item.deviceId).then(
			(inventoryItem) => (itemType = inventoryItem?.typ ?? undefined)
		);
	});
</script>

<a
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
	class:secondary
	class:selectedItem={isSelected}
	href={`/funk/device/${deviceId}`}
>
	<div class="text-2xl">{eventTypeToEmoji(event.type)}</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap font-bold">{deviceId}</div>
			<div class="flex gap-1">
				<div
					class="rounded-xl text-sm px-2 h-min bg-green-200 whitespace-nowrap"
					class:isBorrowed={event.type === 'borrowed'}
				>
					{itemType ?? eventTypeToFriendlyString(event.type)}
				</div>
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

	.isBorrowed {
		@apply bg-red-200;
	}
</style>
