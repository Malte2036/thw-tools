<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import {
		userToFriendlyString,
		type InventarItem,
		type InventarItemEvent,
		type InventarItemEventType
	} from '../api/inventarItem';

	export let deviceId: string;

	export let lastEvent: InventarItemEvent | undefined;

	export let onSubmit: (eventType: InventarItemEventType) => void;

	const isBorrowed = lastEvent?.type === 'borrowed';
</script>

<Dialog title="Du hast ein Gerät gescannt">
	<div slot="content">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				{#if lastEvent}
					<div>
						Das Gerät mit der ID <strong>{deviceId}</strong> ist derzeit
						{#if lastEvent.type === 'borrowed'}
							von <p class="inline italic font-bold">{userToFriendlyString(lastEvent.user)}</p>
							<strong>ausgeliehen</strong>.
						{:else}
							<strong>nicht ausgeliehen</strong>.
						{/if}
					</div>
				{:else}
					<div>
						Das Gerät mit der ID <strong>{deviceId}</strong> existiert noch nicht und wird zur Inventarliste
						hinzugefügt.
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div slot="footer" class="flex flex-row gap-2 w-full justify-between">
		<Button secondary={!isBorrowed} click={() => onSubmit('returned')}>Zurückgeben</Button>
		<Button secondary={isBorrowed} click={() => onSubmit('borrowed')}>Ausleihen</Button>
	</div>
</Dialog>
