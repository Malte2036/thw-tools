<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import Input from '$lib/Input.svelte';
	import { resetVisibleInventoryColumns } from '$lib/shared/stores/inventoryColumnStore';

	interface Props {
		columns: readonly { id: string; label: string }[];
		visibleColumns: string[];
		onToggleColumn: (columnId: string) => void;
		onClose: () => void;
		lastScanAfter: string;
		lastScanBefore: string;
		onLastScanFilterChange: (type: 'after' | 'before' | 'never', value: string) => void;
		lastScanNever: string;
	}

	let {
		columns,
		visibleColumns,
		onToggleColumn,
		onClose,
		lastScanAfter = '',
		lastScanBefore = '',
		onLastScanFilterChange,
		lastScanNever
	}: Props = $props();

	const handleDateChange = (type: 'after' | 'before' | 'never', event: Event) => {
		const target = event.target as HTMLInputElement;
		onLastScanFilterChange(type, target.value);
	};
</script>

<Dialog title="Inventar Einstellungen">
	<div slot="content" class="flex flex-col gap-4">
		<div class="text-sm text-gray-600">
			Hier kannst du einstellen, welche Spalten in der Tabelle angezeigt werden sollen.
		</div>
		<div class="flex flex-row gap-2 justify-between">
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
			<div>
				<button
					class="text-xs text-thw-500 hover:text-thw-700 underline"
					onclick={resetVisibleInventoryColumns}>Spalten zurücksetzen</button
				>
			</div>
		</div>

		<div class="border-t border-gray-300 pt-4 mt-2">
			<div class="flex justify-between items-center mb-2">
				<div class="text-sm text-gray-600">Filter für "Letzter Scan"</div>
				<button
					class="text-xs text-thw-500 hover:text-thw-700 underline"
					onclick={() => {
						onLastScanFilterChange('after', '');
						onLastScanFilterChange('before', '');
						onLastScanFilterChange('never', 'false');
					}}
				>
					Filter zurücksetzen
				</button>
			</div>
			<div class="flex flex-col gap-2">
				<Toggle
					checked={lastScanNever === 'true'}
					label="Nur Items ohne Scan anzeigen"
					on:change={() =>
						onLastScanFilterChange('never', lastScanNever === 'true' ? 'false' : 'true')}
				/>
				<Input
					type="date"
					label="Letzter Scan nach"
					inputValue={lastScanAfter}
					onInput={(e) => handleDateChange('after', e)}
				/>
				<Input
					type="date"
					label="Letzter Scan vor"
					inputValue={lastScanBefore}
					onInput={(e) => handleDateChange('before', e)}
				/>
			</div>
		</div>
	</div>
	<div slot="footer" class="flex flex-row justify-between w-full">
		<div></div>
		<Button click={onClose}>Übernehmen</Button>
	</div>
</Dialog>
