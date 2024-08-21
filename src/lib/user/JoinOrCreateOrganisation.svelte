<script lang="ts">
	import type { Organisation } from '$lib/api/organisationApi';
	import { getOrganisations } from '$lib/api/organisationApi';
	import OrganisationList from '$lib/user/OrganisationList.svelte';
	import { onMount } from 'svelte';

	let organisations: Organisation[] = [];

	onMount(async () => {
		console.log('User page');
		organisations = await getOrganisations();
		console.log(organisations);
	});
</script>

<div class="flex flex-col gap-2">
	<div>
		Du bist in noch keiner Organisation. Möchtest du einer Organisation beitreten oder eine neue
		Organisation erstellen?
	</div>

	<h1 class="font-bold text-2xl">Organisationen:</h1>
	<OrganisationList {organisations} />
</div>
