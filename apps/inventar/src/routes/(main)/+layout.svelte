<script lang="ts">
	import { user } from '$lib/shared/stores/userStore';
	import { funk } from '$lib/shared/stores/funkStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const subscribeToData = () => {
		$user.fetching = data.organisation;
		data.organisation.then((org) => ($user.organisation = org));

		$inventory.fetching = data.inventoryItems;
		data.inventoryItems.then((res) => {
			$inventory.inventoryItems = res.data;
			$inventory.fromCache = res.fromCache;

			if (res.fromCache) {
				$bannerMessage = {
					message:
						'Die Inventar-Items wurden aus dem Cache geladen. Gehe online, um die neuesten Daten zu erhalten.',
					type: 'info',
					autoDismiss: {
						duration: 5000
					}
				};
			}
		});

		$funk.fetching = data.funkData;
		data.funkData.then((funkData) => {
			$funk.funkItems = funkData?.funkItems ?? null;
			$funk.funkItemEventBulks = funkData?.funkItemEventBulks ?? null;
		});
	};
	$: data && subscribeToData();
</script>

<slot></slot>
