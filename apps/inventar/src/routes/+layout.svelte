<script lang="ts">
	import '@thw-tools/web-components/src';

	import { dev, version } from '$app/environment';
	import { PUBLIC_UMAMI_ENDPOINT, PUBLIC_UMAMI_WEBSITEID } from '$env/static/public';

	import Banner from '$lib/Banner.svelte';
	import { FeedbackDialog, InstallPWADialog } from '@thw-tools/svelte-components';
	import NavigationBar from '$lib/navigation/NavigationBar.svelte';
	import PWAUpdateNotification from '$lib/PWAUpdateNotification.svelte';
	import { dateToFriendlyString } from '@thw-tools/shared';
	import '../app.css';
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
		<div class="text-gray-400">|</div>
		<div class="text-gray-400">
			Build {dateToFriendlyString(new Date(+version))}
		</div>
	</div>

	{#if showFeedback}
		<FeedbackDialog onClose={() => (showFeedback = false)} />
	{/if}

	{#if showInstallPWAHelp}
		<InstallPWADialog onClose={() => (showInstallPWAHelp = false)} />
	{/if}
</div>
