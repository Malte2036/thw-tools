<script lang="ts">
	import { run } from 'svelte/legacy';

	import { invalidateAll } from '$app/navigation';
	import { exportFunkItemEventBulksAsCsv } from '$lib/api/funkApi';
	import { userToFriendlyString, type FunkItem, type FunkItemEventBulk } from '$lib/api/funkModels';
	import { generateInviteLink, type Organisation } from '$lib/api/organisation';
	import { leaveOrganisation } from '$lib/api/organisationApi';
	import Button from '$lib/Button.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import { funk } from '$lib/shared/stores/funkStore';
	import { user } from '$lib/shared/stores/userStore';
	import Table from '$lib/Table.svelte';
	import Card from '$lib/Card.svelte';
	import InfoItem from '$lib/InfoItem.svelte';

	function getBorrowedBatteryCount(): number {
		return (
			$funk.funkItemEventBulks?.reduce(
				(acc, bulk) => acc + (bulk.eventType === 'borrowed' ? 1 : -1) * bulk.batteryCount,
				0
			) ?? 0
		);
	}

	async function exportInventarAsCsv() {
		const blob = await exportFunkItemEventBulksAsCsv();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `inventar_${$user.organisation?.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const leaveOrg = async () => {
		await leaveOrganisation();

		bannerMessage.set({
			message: 'Organisation verlassen!',
			type: 'info',
			autoDismiss: {
				duration: 5000
			}
		});

		invalidateAll();
	};

	const getBorrowedDevicesCount = () => {
		return (
			$funk.funkItems?.filter(
				(item) => getLastFunkItemEventByFunkItemInternalId($funk, item._id)?.type === 'borrowed'
			).length ?? 0
		);
	};

	const borrowedCount: number = getBorrowedDevicesCount();
	run(() => {
		$funk && getBorrowedDevicesCount();
	});

	const organisation: Organisation | null = $user.organisation;
</script>

{#if !organisation}
	<div class="flex flex-col gap-4 items-center p-4">
		<div class="text-2xl font-bold">Du bist in keiner Organisation</div>
		<div class="text-lg text-gray-500">Erstelle eine Organisation oder lass dich einladen.</div>
	</div>
{:else}
	<div class="flex flex-col gap-6 p-4">
		<Card title="Organisation">
			<InfoItem label="Name" value={organisation?.name ?? ''} />
		</Card>

		<Card title="Inventar Übersicht">
			<InfoItem
				label="Ausgeliehene Geräte"
				value={`${borrowedCount} von ${$funk.funkItems?.length}`}
			/>
			<InfoItem label="Ausgeliehene Batterien" value={getBorrowedBatteryCount()} />
		</Card>

		<Card title={`Mitglieder (${$user.organisation?.members.length})`}>
			<Table
				header={['Name', 'E-Mail']}
				values={($user.organisation?.members ?? []).map((member) => [
					userToFriendlyString(member),
					member.email ?? ''
				])}
			/>
			<div class="mt-3">
				<Button secondary click={leaveOrg}>Organisation verlassen</Button>
			</div>
		</Card>

		<Card title="Einladungslink">
			<div class="flex flex-col gap-4">
				<div class="text-gray-600">
					Mit diesem Link können andere THW-Mitglieder deiner Organisation beitreten:
				</div>
				<a
					class="break-all text-thw underline"
					href={generateInviteLink(organisation)}
					target="_blank"
					rel="noopener noreferrer"
				>
					{generateInviteLink(organisation)}
				</a>
				<div class="flex gap-2">
					<Button
						secondary
						click={() => {
							navigator.clipboard.writeText(generateInviteLink(organisation));
							bannerMessage.set({
								message: 'Einladungslink kopiert',
								autoDismiss: { duration: 5000 },
								type: 'info'
							});
						}}
					>
						Link kopieren
					</Button>
					<Button
						secondary
						click={async () => {
							try {
								await navigator.share({
									title: `Einladungslink - ${organisation.name}`,
									url: generateInviteLink(organisation)
								});
								$bannerMessage = {
									message: 'Einladungslink geteilt',
									autoDismiss: { duration: 5000 },
									type: 'info'
								};
							} catch (error) {
								console.error('Error sharing link', error);
							}
						}}
					>
						Link teilen
					</Button>
				</div>
			</div>
		</Card>

		<Card title="Exportieren">
			<Button click={exportInventarAsCsv}>Exportiere die Funkgeräteliste als CSV</Button>
		</Card>
	</div>
{/if}
