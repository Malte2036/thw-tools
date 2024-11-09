<script lang="ts">
	import { run } from 'svelte/legacy';

	import { funk } from '$lib/shared/stores/funkStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { user } from '$lib/shared/stores/userStore';

	import ErrorDisplay from '$lib/ErrorDisplay.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import NoOrganisation from '$lib/funk/NoOrganisation.svelte';
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
