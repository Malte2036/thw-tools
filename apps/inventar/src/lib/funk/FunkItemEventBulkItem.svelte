<script lang="ts">
	import { getFunkItemByInternalId } from '$lib/shared/stores/funkStore';
	import { dateToFriendlyString } from '$lib/utils';
	import {
		batteryCountToFriendlyString,
		eventTypeToEmoji,
		type FunkItemEventBulk
	} from '../api/funkModels';
	import InventarItemEventTypeBadge from './FunkItemEventTypeBadge.svelte';
	import { funk } from '$lib/shared/stores/funkStore';
	import { user } from '$lib/shared/stores/userStore';

	import { getOrganisationUserByInternalId } from '$lib/shared/stores/userStore';

	interface Props {
		bulk: FunkItemEventBulk;
	}

	let { bulk }: Props = $props();

	const bulkUser = getOrganisationUserByInternalId($user, bulk.user.id);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
>
	<div class="text-2xl">
		{eventTypeToEmoji(bulk.eventType)}
	</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap text-sm">
				<span class="italic">
					{#if bulkUser}
						{bulkUser.firstName ?? ''}
						{bulkUser.lastName ?? ''}
					{/if}
				</span>
				{' am '}
				<span>
					{dateToFriendlyString(new Date(bulk.date))}
				</span>
			</div>
			<InventarItemEventTypeBadge type={bulk.eventType} />
		</div>
		<ul class="pl-3 flex flex-col justify-start w-full text-sm text-gray-500 list-disc">
			<li>
				{batteryCountToFriendlyString(bulk.batteryCount)}
			</li>
			<li>
				{bulk.funkItemEvents
					.map((event) => getFunkItemByInternalId($funk, event.funkItem.id)?.deviceId)
					.sort()
					.join(', ')}
			</li>
		</ul>
	</div>
</div>
