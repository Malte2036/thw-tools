<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Button from '$lib/Button.svelte';

	export let show = false;
	export let onClose: () => void;
</script>

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
		<Button click={onClose}>Schließen</Button>
	</div>
</Dialog>
