<script lang="ts">
	import { exportFunkItemEventBulksAsCsv } from '$lib/api/funkApi';
	import { funk } from '$lib/shared/stores/funkStore';
	import { user } from '$lib/shared/stores/userStore';
	import { getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import Button from '$lib/Button.svelte';
	import Card from '$lib/Card.svelte';
	import InfoItem from '$lib/InfoItem.svelte';
	import LinkButton from '$lib/LinkButton.svelte';

	function getBorrowedBatteryCount(): number {
		return (
			$funk.funkItemEventBulks?.reduce(
				(acc, bulk) => acc + (bulk.eventType === 'borrowed' ? 1 : -1) * bulk.batteryCount,
				0
			) ?? 0
		);
	}

	const getBorrowedDevicesCount = () => {
		return (
			$funk.funkItems?.filter(
				(item) => getLastFunkItemEventByFunkItemInternalId($funk, item.id)?.type === 'borrowed'
			).length ?? 0
		);
	};

	async function exportInventarAsCsv() {
		const blob = await exportFunkItemEventBulksAsCsv();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `inventar_${$user.organisation?.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const borrowedCount = getBorrowedDevicesCount();
	const organisation = $user.organisation;
</script>

{#if !organisation}
	<div class="flex flex-col gap-4 items-center p-4">
		<div class="text-2xl font-bold">Du bist in keiner Organisation</div>
		<div class="text-lg text-gray-500">Erstelle eine Organisation oder lass dich einladen.</div>
		<LinkButton url="/organisation">Zur Organisationsverwaltung</LinkButton>
	</div>
{:else}
	<div class="flex flex-col gap-6 p-4">
		<Card title="Organisation">
			<InfoItem label="Name" value={organisation.name} />
		</Card>

		<Card title="Inventar Übersicht">
			<InfoItem
				label="Ausgeliehene Geräte"
				value={`${borrowedCount} von ${$funk.funkItems?.length}`}
			/>
			<InfoItem label="Ausgeliehene Batterien" value={getBorrowedBatteryCount()} />
		</Card>

		<Card title="Exportieren">
			<Button click={exportInventarAsCsv}>Exportiere die Funkgeräteliste als CSV</Button>
		</Card>

		<Card title="Organisationsverwaltung">
			<div class="flex flex-col gap-4">
				<div class="text-gray-600">
					Verwalte deine Organisation, Mitglieder und Einladungen unter:
				</div>
				<LinkButton url="/organisation">Zur Organisationsverwaltung</LinkButton>
			</div>
		</Card>
	</div>
{/if}
