<script lang="ts">
	import { run } from 'svelte/legacy';

	import { user } from '$lib/shared/stores/userStore';
	import { funk } from '$lib/shared/stores/funkStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	import type { LayoutData } from './$types';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import NoOrganisation from '$lib/funk/NoOrganisation.svelte';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';

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
			if (res.fromCache) {
				$bannerMessage = {
					message:
						'Die Inventar-Items wurden aus dem lokalen Speicher geladen. Die Daten werden im Hintergrund aktualisiert.',
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

{#await $user.fetching}
	<LoadingSpinner />
{:then}
	{@render children?.()}
{:catch error}
	{#if error.status === 404}
		<NoOrganisation />
	{:else}
		<div class="p-2">
			<ErrorDisplay
				label="Beim Abrufen der Organisation aus der Datenbank ist leider ein Fehler aufgetreten."
				{error}
			/>
		</div>
	{/if}
{/await}
