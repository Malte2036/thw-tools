<script lang="ts">
	import { eventTypeToFriendlyString, type FunkItemEventType } from '../api/funkModels';

	interface Props {
		type: FunkItemEventType;
	}

	let { type }: Props = $props();
</script>

<div class="rounded-xl text-sm px-2 h-min bg-green-200" class:isBorrowed={type === 'borrowed'}>
	{eventTypeToFriendlyString(type)}
</div>

<style lang="scss">
	.isBorrowed {
		@apply bg-red-200;
	}
</style>
