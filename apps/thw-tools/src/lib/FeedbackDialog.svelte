<script lang="ts">
	import { Dialog } from '@thw-tools/svelte-components';
	import { Button } from '@thw-tools/svelte-components';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();
</script>

<Dialog title="Feedback">
	{#snippet content()}
		<div >
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
	{/snippet}
	{#snippet footer()}
		<div >
			<Button click={onClose}>Schließen</Button>
		</div>
	{/snippet}
</Dialog>
