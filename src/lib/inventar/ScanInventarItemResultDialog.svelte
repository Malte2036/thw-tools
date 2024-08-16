<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';

	export let deviceId: string;
	export let isUsed: boolean | undefined;
	export let alreadyExists: boolean;

	export let onSubmit: (isUsed: boolean) => void;

	const showBorrowButton = (alreadyExists && !isUsed) || !alreadyExists;
	const showReturnButton = (alreadyExists && isUsed) || !alreadyExists;
</script>

<Dialog title="Du hast ein Gerät gescannt">
	<div slot="content">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				{#if alreadyExists}
					<div>
						Das Gerät mit der ID <strong>{deviceId}</strong> ist derzeit
						{#if isUsed}
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
	<div slot="footer" class="flex flex-row gap-2">
		{#if showReturnButton}
			<Button secondary={!alreadyExists} click={() => onSubmit(false)}>Zurückgeben</Button>
		{/if}
		{#if showBorrowButton}
			<Button click={() => onSubmit(true)}>Ausleihen</Button>
		{/if}
	</div>
</Dialog>
