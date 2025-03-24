<script lang="ts">
	import { Button, Dialog } from '@thw-tools/svelte-components';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();
</script>

<Dialog title="Kamera-Zugriff nicht erlaubt">
	{#snippet content()}
		<div class="flex flex-col gap-2">
			<div>
				<p class="font-bold">Der Zugriff auf die Kamera wurde nicht erlaubt.</p>
				<p>Bitte erlaube den Zugriff auf die Kamera im Browser, um QR-Codes scannen zu können.</p>
			</div>
			<ul>
				<li>
					<strong>Chrome:</strong> Klicke auf das Einstellungs-Symbol in der Adressleiste vor der URL
					und setze die Kamera auf <em>"Zulassen"</em>.
				</li>
				<li>
					<strong>Firefox:</strong> Klicke auf das Schloss-Symbol in der Adressleiste vor der URL und
					setze die Kamera auf <em>"Zulassen"</em>.
				</li>
				<li>
					<strong>Safari (iOS 18+):</strong> Klicke auf das Symbol links neben der URL. Klicke auf die
					drei Punkte und unter <em>Website Settings</em> setze die Kamera auf <em>"Zulassen"</em>.
				</li>
				<li>
					<strong>Safari (iOS 17-):</strong> Tippe auf das <em>aA-Symbol</em> links in der
					Adressleiste. Gehe zu <em>Website-Einstellungen</em> und setzte <em>Kamera</em> auf
					<em>"Zulassen"</em>.
				</li>
			</ul>
			<p>
				Nachdem du die Einstellungen geändert hast, lade diese Seite neu, um es erneut zu versuchen.
			</p>
		</div>
	{/snippet}
	{#snippet footer()}
		<div>
			<Button click={onClose}>Schließen</Button>
		</div>
	{/snippet}
</Dialog>
