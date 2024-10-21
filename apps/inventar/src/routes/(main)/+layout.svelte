<script lang="ts">
	import { run } from 'svelte/legacy';

	import { user } from '$lib/shared/stores/userStore';
	import { funk } from '$lib/shared/stores/funkStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

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
	run(() => {
		data && subscribeToData();
	});
</script>

{@render children?.()}
