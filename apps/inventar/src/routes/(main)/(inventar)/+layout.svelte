<script lang="ts">
	import { user } from '$lib/shared/stores/userStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const subscribeToData = () => {
		$inventory.fetching = data.inventoryItems;

		data.inventoryItems.then((items) => ($inventory.inventoryItems = items));
	};
	$: data && subscribeToData();
</script>

<slot></slot>
