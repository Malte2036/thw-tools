<script lang="ts">
	import { eventTypeToFriendlyString, type InventarItemEventType } from './inventarItem';

	export let type: InventarItemEventType;
</script>

<div class="rounded-xl text-sm px-2 h-min bg-green-200" class:isBorrowed={type === 'borrowed'}>
	{eventTypeToFriendlyString(type)}
</div>

<style lang="scss">
	.isBorrowed {
		@apply bg-red-200;
	}
</style>
