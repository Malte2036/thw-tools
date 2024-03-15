<script lang="ts">
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';

	export let onClose: () => void = () => {};
</script>

<Dialog title="Offline Verfügbarkeit als App auf Android">
	<div slot="content" class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<div>Diese Seite kann als App offline heruntergeladen werden.</div>
			<div>
				Klicke dazu im Android Chrome Browser auf das Menü und wähle "Als App installieren".
			</div>

			<div>Auf Android-Geräten sieht das wie folgt aus:</div>
			<img
				src="/help/android-install-pwa.gif"
				class="w-64 max-md:w-48 aspect-auto mx-auto border-2 border-thw-500 rounded-md mt-4"
				alt="Android Offline Verfügbarkeit"
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
			müssen als einzelne App installiert werden. Öffne dazu die Seiten im Android Chrome Browser und
			folge den oben gegebenen Anweisungen analog.
		</div>
	</div>
	<div slot="footer">
		<Button click={onClose} dataUmamiEvent="Close Offline Availability Dialog">Schließen</Button>
	</div>
</Dialog>
