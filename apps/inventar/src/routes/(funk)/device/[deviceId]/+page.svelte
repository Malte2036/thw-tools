<script lang="ts">
	import FunkItemEventsList from '$lib/funk/FunkItemEventsList.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-2 p-4">
	<LinkButton url="/">Zurück zur Funkgeräteliste</LinkButton>
	<FunkItemEventsList deviceId={data.deviceId ?? ''} />
</div>
