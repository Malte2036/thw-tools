<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import { resetVisibleInventoryColumns } from '$lib/shared/stores/inventoryColumnStore';

	interface Props {
		columns: readonly { id: string; label: string }[];
		visibleColumns: string[];
		onToggleColumn: (columnId: string) => void;
		onClose: () => void;
	}

	let { columns, visibleColumns, onToggleColumn, onClose }: Props = $props();
</script>

<Dialog title="Inventar Einstellungen">
	<div slot="content" class="flex flex-col gap-4">
		<div class="text-sm text-gray-600">
			Hier kannst du einstellen, welche Spalten in der Tabelle angezeigt werden sollen.
		</div>
		<div class="flex flex-col gap-2">
			{#each columns as column}
				<Toggle
					checked={visibleColumns.includes(column.id)}
					label={column.label}
					on:change={() => onToggleColumn(column.id)}
					disabled={visibleColumns.length === 1 && visibleColumns.includes(column.id)}
				/>
			{/each}
		</div>
	</div>
	<div slot="footer" class="flex flex-row justify-between w-full">
		<Button secondary click={resetVisibleInventoryColumns}>Zurücksetzen</Button>
		<Button click={onClose}>Schließen</Button>
	</div>
</Dialog>
