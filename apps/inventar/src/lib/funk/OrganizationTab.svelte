<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { userToFriendlyString } from '$lib/api/funkModels';
	import { generateInviteLink, type Organisation, type User } from '$lib/api/organisationModels';
	import { leaveOrganisation } from '$lib/api/organisationApi';
	import Button from '$lib/Button.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { user } from '$lib/shared/stores/userStore';
	import Table from '$lib/Table.svelte';
	import Card from '$lib/Card.svelte';
	import InfoItem from '$lib/InfoItem.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import ErrorState from '$lib/ErrorDisplay.svelte';

	const organisation: Organisation | null = $derived($user.organisation);
	const memberCount = $derived($user.organisation?.members.length ?? 0);
	const memberTableValues = $derived(
		($user.organisation?.members ?? []).map((member) => [userToFriendlyString(member)])
	);

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

	const copyInviteLink = () => {
		if (!organisation) return;

		navigator.clipboard.writeText(generateInviteLink(organisation));
		bannerMessage.set({
			message: 'Einladungslink kopiert',
			autoDismiss: { duration: 5000 },
			type: 'info'
		});
	};

	const shareInviteLink = async () => {
		if (!organisation) return;

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
	};
</script>

{#await $user.fetching}
	<LoadingSpinner />
{:then}
	{#if !organisation}
		<div class="flex flex-col gap-4 items-center p-4">
			<div class="text-2xl font-bold">Du bist in keiner Organisation</div>
			<div class="text-lg text-gray-500">Erstelle eine Organisation oder lass dich einladen.</div>
		</div>
	{:else}
		<div class="flex flex-col gap-6 p-4">
			<Card title="Organisation">
				<InfoItem label="Name" value={organisation.name} />
			</Card>

			<Card title={`Mitglieder (${memberCount})`}>
				<Table header={['Name']} values={memberTableValues} />
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
						<Button secondary click={copyInviteLink}>Link kopieren</Button>
						<Button secondary click={shareInviteLink}>Link teilen</Button>
					</div>
				</div>
			</Card>
		</div>
	{/if}
{:catch error}
	<div class="p-2">
		<ErrorState
			label="Beim Abrufen der Organisation aus der Datenbank ist leider ein Fehler aufgetreten."
			{error}
		/>
	</div>
{/await}
