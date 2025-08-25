<script lang="ts">
	import { Table, LinkButton } from '@thw-tools/svelte-components';
	import { dateToFriendlyString } from '@thw-tools/shared';
	import type { PageData } from './$types';
	import StatusBadge from '$lib/components/missions/StatusBadge.svelte';

	let { data }: { data: PageData } = $props();

	const headers = ['Name', 'Ort', 'Status', 'Startdatum', ''];
	let rows = $derived(
		data.missions?.map((mission) => [
			mission.name,
			mission.location,
			{
				component: StatusBadge,
				props: { status: mission.status }
			},
			dateToFriendlyString(new Date(mission.startDate)),
			{
				component: LinkButton,
				props: {
					url: `/missions/${mission.id}`,
					children: 'Öffnen'
				}
			}
		]) ?? []
	);
</script>

<div class="container mx-auto p-4">
	<div class="flex justify-between items-center mb-4">
		<h1 class="text-2xl font-bold">Einsätze</h1>
		<LinkButton url="/missions/new">Neuen Einsatz starten</LinkButton>
	</div>

	{#if rows.length > 0}
		<Table {headers} {rows} />
	{:else}
		<div class="bg-white shadow rounded-lg p-8 text-center">
			<p class="text-gray-500">Noch keine Einsätze erstellt.</p>
		</div>
	{/if}
</div>

<svelte:head>
	<title>Einsätze</title>
</svelte:head>
