<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { exportInventarItemEventBulksAsCsv } from '$lib/api/inventarApi';
	import {
		userToFriendlyString,
		type InventarItem,
		type InventarItemEventBulk
	} from '$lib/api/inventarItem';
	import { generateInviteLink, type Organisation } from '$lib/api/organisation';
	import { leaveOrganisation } from '$lib/api/organisationApi';
	import Button from '$lib/Button.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	export let organisation: Organisation | undefined;
	export let inventarItems: InventarItem[];
	export let inventarItemEventBulks: InventarItemEventBulk[];

	function getBorrowedBatteryCount(): number {
		return inventarItemEventBulks.reduce(
			(acc, bulk) => acc + (bulk.eventType === 'borrowed' ? 1 : -1) * bulk.batteryCount,
			0
		);
	}

	async function exportInventarAsCsv() {
		const blob = await exportInventarItemEventBulksAsCsv();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `inventar_${organisation?.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString()}.csv`;
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
</script>

{#if !organisation}
	<div class="text-center text-2xl">Du bist in keiner Organisation.</div>
	<div class="text-center text-lg">Erstelle eine Organisation oder lass dich einladen.</div>
{:else}
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<div class="font-bold text-2xl">Organisation:</div>
			<p>Name: {organisation?.name}</p>
		</div>
		<div class="	flex flex-col gap-2">
			<div class="font-bold text-xl">Inventar:</div>
			<p>
				Ausgeliehene Geräte: {inventarItems.filter((item) => item.lastEvent.type === 'borrowed')
					.length} von {inventarItems.length}
			</p>
			<p>
				Ausgeliehene Batterien: {getBorrowedBatteryCount()}
			</p>
		</div>
		<div class="flex flex-col gap-2">
			<div class="font-bold text-xl">Mitglieder:</div>
			<ul class="flex flex-col gap-2 list-disc pl-4">
				{#each organisation?.members ?? [] as member}
					<li>
						{userToFriendlyString(member)}
						<span class="text-gray-500">
							({member.email})
						</span>
					</li>
				{/each}
			</ul>
			<Button secondary click={leaveOrg}>Organisation verlassen</Button>
		</div>
		<div class="flex flex-col gap-2">
			<div class="font-bold text-xl">Einladungslink:</div>
			<a
				class="break-all text-thw underline"
				href={generateInviteLink(organisation)}
				target="_blank"
			>
				{generateInviteLink(organisation)}
			</a>
			<div class="flex gap-2 w-full">
				<Button
					secondary
					click={() => {
						navigator.clipboard.writeText(generateInviteLink(organisation));

						bannerMessage.set({
							message: 'Einladungslink kopiert',
							autoDismiss: {
								duration: 5 * 1000
							},
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
						} catch (error) {
							console.error('Error sharing link', error);
						}

						$bannerMessage = {
							message: 'Einladungslink geteilt',
							autoDismiss: {
								duration: 5 * 1000
							},
							type: 'info'
						};
					}}
				>
					Link teilen
				</Button>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<div class="font-bold text-xl">Exportieren:</div>
			<Button click={exportInventarAsCsv}>Exportiere Inventar als CSV</Button>
		</div>
	</div>
{/if}
