<script lang="ts">
	import FunkItemEventsList from '$lib/funk/FunkItemEventsList.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="flex flex-col gap-2 p-4">
	<LinkButton url="/funk">Zurück zur Funkgeräteliste</LinkButton>
	{#if data.deviceId}
		<FunkItemEventsList deviceId={data.deviceId} />
	{:else}
		<div>
			<h1>Das Gerät wurde nicht gefunden.</h1>
		</div>
	{/if}
</div>
