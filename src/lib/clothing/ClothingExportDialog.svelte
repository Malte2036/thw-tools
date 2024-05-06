<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';

	export let onSubmit: (firstName: string, lastName: string, note: string) => void;

	let exportFirstName = '';
	let exportLastName = '';
	let exportCustomNote = '';
</script>

<Dialog title="Exportiere Ergebnisse als CSV">
	<div slot="content">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<div>
					Exportiere deine Berechneten Kleidergrößen als CSV-Datei, sodass du diese leicht speichern
					oder versenden kannst.
				</div>
				<div>
					Bei Bedarf kannst du deinen Namen und eine Notiz hinzufügen. Diese Daten werden nur für
					den Export deiner CSV-Datei verwendet und nicht auf dem Server gespeichert.
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<Input bind:inputValue={exportFirstName} label="Vorname" />
				<Input bind:inputValue={exportLastName} label="Nachname" />
				<Input bind:inputValue={exportCustomNote} label="Notiz" />
			</div>
		</div>
	</div>
	<div slot="footer">
		<Button
			click={() => onSubmit(exportFirstName, exportLastName, exportCustomNote)}
			dataUmamiEvent="Export Clothing Sizes">Exportieren</Button
		>
	</div>
</Dialog>
