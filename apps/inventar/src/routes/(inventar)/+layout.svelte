<script lang="ts">
	import { user } from '$lib/shared/stores/userStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const subscribeToData = () => {
		$user.fetching = data.organisation;
		$inventory.fetching = data.inventoryItems;

		data.organisation.then((org) => ($user.organisation = org));
		data.inventoryItems.then((items) => ($inventory.inventoryItems = items));
	};
	$: data && subscribeToData();
</script>

<slot></slot>
