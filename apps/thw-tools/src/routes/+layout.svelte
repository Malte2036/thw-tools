<script lang="ts">
	import '@malte2036/thw-tools-components';

	import { dev } from '$app/environment';
	import { PUBLIC_UMAMI_ENDPOINT, PUBLIC_UMAMI_WEBSITEID } from '$env/static/public';

	// setup service worker for pwa support
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	let ReloadPrompt: any;
	onMount(async () => {
		pwaInfo && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default);
	});

	import '../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';
	import Banner from '$lib/Banner.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Button from '$lib/Button.svelte';
	import InstallPWADialog from '$lib/InstallPWADialog.svelte';

	let title: string | undefined;
	$: title = getCurrentTitleByPath($page.url.pathname);

	function getCurrentTitleByPath(path: string): string | undefined {
		if (path.startsWith('/quiz/agt')) {
			return 'Atemschutz-Quiz';
		} else if (path.startsWith('/quiz/cbrn')) {
			return 'CBRN-Quiz';
		} else if (path.startsWith('/cbrn/protective-suite')) {
			return 'CBRN-Schutzanzug';
		} else if (path === '/') {
			return undefined;
		} else {
			return 'THW-Tools';
		}
	}

	let showFeedback = false;
	let showInstallPWAHelp = false;
</script>

<svelte:head>
	{@html webManifest}

	{#if !dev}
		<script
			async
			defer
			data-website-id={PUBLIC_UMAMI_WEBSITEID}
			src={PUBLIC_UMAMI_ENDPOINT}
		></script>
	{/if}
</svelte:head>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<div class="flex flex-col gap-4 justify-between min-h-screen">
	{#if title !== undefined}
		<Header {title} />
	{/if}
	<Banner />
	<div class="grow">
		<slot />
	</div>
	<div class="flex flex-row justify-center gap-2 mb-3 flex-wrap px-2">
		<div>©2024 Malte Sehmer</div>
		<div class="text-gray-400">|</div>
		<a
			data-umami-event={$page.route.id === '/impressum'
				? 'Close Impressum button'
				: 'Open Impressum button'}
			href={$page.route.id === '/impressum' ? '/' : '/impressum'}
			class="underline">Impressum</a
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
