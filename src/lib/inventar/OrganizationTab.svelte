<script lang="ts">
	import { userToFriendlyString } from '$lib/api/inventarItem';
	import { generateInviteLink, type Organisation } from '$lib/api/organisation';
	import Button from '$lib/Button.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	export let organisation: Organisation | undefined;
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
	</div>
{/if}
