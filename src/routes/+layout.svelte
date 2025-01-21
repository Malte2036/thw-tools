<script lang="ts">
	import '@malte2036/thw-tools-components';
	import { dev, version } from '$app/environment';
	import { PUBLIC_UMAMI_ENDPOINT, PUBLIC_UMAMI_WEBSITEID } from '$env/static/public';
	import '../app.css';
	import { page } from '$app/stores';
	import Banner from '$lib/Banner.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Button from '$lib/Button.svelte';
	import InstallPWADialog from '$lib/InstallPWADialog.svelte';
	import NavigationBar from '$lib/navigation/NavigationBar.svelte';
	import PwaUpdateNotification from '$lib/PWAUpdateNotification.svelte';
	import FeedbackDialog from '$lib/FeedbackDialog.svelte';
	import { onMount } from 'svelte';
	import { formatDate, trackIdentity } from '$lib/utils';

	let showFeedback = false;
	let showInstallPWAHelp = false;

	onMount(() => {
		trackIdentity();
	});
	$: hideFooter = $page.url.pathname.includes('/quiz/');
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

<PwaUpdateNotification />

<div class="h-full flex flex-col gap-4">
	<NavigationBar />
	<Banner />
	<div class="flex-grow flex flex-col">
		<slot />
	</div>
	{#if !hideFooter}
		<div class="flex flex-row justify-center gap-2 mb-3 flex-wrap px-2">
			<div>©2025 Malte Sehmer</div>
			<div class="text-gray-400">|</div>
			<a
				data-umami-event={$page.route.id === '/impressum'
					? 'Close Impressum button'
					: 'Open Impressum button'}
				href={$page.route.id === '/impressum' ? '/' : '/impressum'}
				class="underline">Impressum</a
			>
			<div class="text-gray-400">|</div>
			<a
				data-umami-event={$page.route.id === '/faq' ? 'Close FAQ button' : 'Open FAQ button'}
				href={$page.route.id === '/faq' ? '/' : '/faq'}
				class="underline">FAQ</a
			>
			<div class="text-gray-400">|</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="underline cursor-pointer"
				on:click={() => (showFeedback = true)}
				data-umami-event="Open Feedback Dialog"
			>
				Feedback
			</div>
			<div class="text-gray-400">|</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="underline cursor-pointer"
				data-umami-event="Open Offline Availability Dialog"
				on:click={() => (showInstallPWAHelp = true)}
			>
				Als App installieren
			</div>
			<div class="text-gray-400">|</div>
			<div class="text-gray-400">
				Build {formatDate(+version)}
			</div>
		</div>
	{/if}

	{#if showFeedback}
		<FeedbackDialog show={showFeedback} onClose={() => (showFeedback = false)} />
	{/if}

	{#if showInstallPWAHelp}
		<InstallPWADialog onClose={() => (showInstallPWAHelp = false)} />
	{/if}
</div>
