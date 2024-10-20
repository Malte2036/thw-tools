<script lang="ts">
	import { user } from '$lib/shared/stores/userStore';
	import { funk } from '$lib/shared/stores/funkStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const subscribeToData = () => {
		$user.fetching = data.organisation;
		data.organisation.then((org) => ($user.organisation = org));

		$inventory.fetching = data.inventoryItems;
		data.inventoryItems.then((items) => ($inventory.inventoryItems = items));

		$funk.fetching = data.funkData;
		data.funkData.then((funkData) => {
			$funk.funkItems = funkData?.funkItems ?? null;
			$funk.funkItemEventBulks = funkData?.funkItemEventBulks ?? null;
		});
	};
	$: data && subscribeToData();
</script>

<slot></slot>
