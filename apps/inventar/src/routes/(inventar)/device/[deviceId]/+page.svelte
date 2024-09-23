<script lang="ts">
	import Button from '$lib/Button.svelte';
	import InventarItemEventsList from '$lib/inventar/InventarItemEventsList.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-2 p-4">
	<LinkButton url="/">Zurück zur Inventarliste</LinkButton>

	<InventarItemEventsList deviceId={data.deviceId ?? ''} />
</div>
