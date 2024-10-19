<script lang="ts">
	import { funk } from '$lib/shared/stores/funkStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const subscribeToData = () => {
		$funk.fetching = data.funkData;

		data.funkData.then((funkData) => {
			$funk.funkItems = funkData?.funkItems ?? null;
			$funk.funkItemEventBulks = funkData?.funkItemEventBulks ?? null;
		});
	};
	$: data && subscribeToData();
</script>

<slot></slot>
