<script lang="ts">
	import type { PageData } from './$types';
	import { user } from '$lib/shared/stores/userStore';
	import { funk } from '$lib/shared/stores/funkStore';

	export let data: PageData;

	const subscribeToData = () => {
		$user.fetching = data.organisation;
		$funk.fetching = data.funkData;

		data.organisation.then((org) => ($user.organisation = org));
		data.funkData.then((funkData) => {
			$funk.funkItems = funkData?.funkItems ?? null;
			$funk.funkItemEventBulks = funkData?.funkItemEventBulks ?? null;
		});
	};
	$: data && subscribeToData();
</script>

<slot></slot>
