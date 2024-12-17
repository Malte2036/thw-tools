<script lang="ts">
	import '@malte2036/thw-tools-components';

	import { dev } from '$app/environment';
	import { PUBLIC_UMAMI_ENDPOINT, PUBLIC_UMAMI_WEBSITEID } from '$env/static/public';

	import '../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';
	import Banner from '$lib/Banner.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Button from '$lib/Button.svelte';
	import InstallPWADialog from '$lib/InstallPWADialog.svelte';
	import type { LayoutData } from './$types';
	import NavigationBar from '$lib/navigation/NavigationBar.svelte';
	import PWAUpdateNotification from '$lib/PWAUpdateNotification.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let showFeedback = $state(false);
	let showInstallPWAHelp = $state(false);
</script>

<svelte:head>
	<link rel="manifest" href="/manifest.json" />

	{#if !dev}
		<script
			async
			defer
			data-website-id={PUBLIC_UMAMI_WEBSITEID}
			src={PUBLIC_UMAMI_ENDPOINT}
		></script>
	{/if}
</svelte:head>

<div class="flex flex-col gap-4 justify-between min-h-screen">
	<NavigationBar />
	<Banner />
	<PWAUpdateNotification />
	<div class="grow">
		{@render children?.()}
	</div>
	<div class="flex flex-row justify-center gap-2 mb-3 flex-wrap px-2">
		<div>©2024 Malte Sehmer</div>
		<div class="text-gray-400">|</div>
		<a
			data-umami-event={'Open Impressum button'}
			href={'https://thw-tools.de/impressum'}
			class="underline">Impressum</a
		>
		<div class="text-gray-400">|</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="underline cursor-pointer"
			onclick={() => (showFeedback = true)}
			data-umami-event="Open Feedback Dialog"
		>
			Feedback
		</div>
		<div class="text-gray-400">|</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="underline cursor-pointer"
			data-umami-event="Open Offline Availability Dialog"
			onclick={() => (showInstallPWAHelp = true)}
		>
			Als App installieren
		</div>
	</div>

	{#if showFeedback}
		<Dialog title="Feedback">
			<div slot="content">
				<div class="flex flex-col gap-2">
					<div>Du hast Ideen für neue Tools, weitere Quizfragen oder Feedback?</div>
					<div>
						Schreib mir gerne eine Direktnachricht in
						<a
							data-umami-event="Feedback Dialog Hermine link"
							href="https://app.thw-messenger.de/thw/app#/contacts/profile/1990855"
							target="_blank"
							class="underline text-thw">Hermine</a
						> (Malte Sehmer).
					</div>
				</div>
			</div>
			<div slot="footer">
				<Button click={() => (showFeedback = false)}>Schließen</Button>
			</div>
		</Dialog>
	{/if}

	{#if showInstallPWAHelp}
		<InstallPWADialog onClose={() => (showInstallPWAHelp = false)} />
	{/if}
</div>
