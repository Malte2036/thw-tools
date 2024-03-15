<script lang="ts">
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';

	export let onClose: () => void = () => {};

	function detectOS() {
		const userAgent = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(userAgent)) {
			return 'iOS';
		} else if (/android/.test(userAgent)) {
			return 'Android';
		} else {
			return 'Unknown';
		}
	}
	const os = detectOS();
	let visibleOS: 'iOS' | 'Android' = os !== 'Unknown' ? os : 'Android';
</script>

<Dialog title={`Offline Verfügbarkeit als App auf ${visibleOS}`}>
	<div slot="content" class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<div>Diese Seite kann als App offline heruntergeladen werden.</div>
			<div>
				{#if visibleOS === 'iOS'}
					Klicken Sie dazu in Safari auf das Teilen-Symbol und wähle "Zum Home-Bildschirm".
				{:else}
					Klicke dazu im Android Chrome Browser auf das Menü und wähle "Als App installieren".
				{/if}
			</div>

			<div>
				Die Seite wird dann als App auf deinem Gerät installiert und kann auch ohne
				Internetverbindung genutzt werden.
			</div>
			<br />

			<div>Auf {visibleOS}-Geräten sieht das wie folgt aus:</div>
			<img
				src={`/help/${visibleOS.toLowerCase()}-install-pwa.gif`}
				class="w-64 max-md:w-48 aspect-auto mx-auto border-2 border-thw-500 rounded-md mt-4"
				alt={`${visibleOS} Offline Verfügbarkeit`}
			/>
		</div>
		<div class="italic">
			<div class="font-bold inline-block">Information:</div>
			Die anderen Applikationen{' '}<a
				href="https://finnentest.thw-tools.de"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-thw">THW Finnentest</a
			>
			und
			<a
				href="https://elektro.thw-tools.de"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-thw">THW Elektro Spannungsfall</a
			>
			müssen als einzelne App installiert werden. Öffne dazu die Seiten
			{#if visibleOS === 'iOS'}
				im Safari Browser
			{:else}
				im Android Chrome Browser
			{/if} und folge den oben gegebenen Anweisungen analog.
		</div>
	</div>
	<div slot="footer" class="flex flex-row justify-between w-full">
		<Button
			secondary
			click={() => (visibleOS = visibleOS === 'iOS' ? 'Android' : 'iOS')}
			dataUmamiEvent={visibleOS === 'iOS'
				? 'Switch to Android Install PWA Help'
				: 'Switch to iOS Install PWA Help'}
		>
			zur
			{#if visibleOS === 'iOS'}
				Android
			{:else}
				iOS
			{/if}
			Anleitung
		</Button>
		<Button click={onClose} dataUmamiEvent="Close Offline Availability Dialog">Schließen</Button>
	</div>
</Dialog>
