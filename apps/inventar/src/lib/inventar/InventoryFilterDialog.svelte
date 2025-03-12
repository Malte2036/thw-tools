<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import Input from '$lib/Input.svelte';
	import { resetVisibleInventoryColumns } from '$lib/shared/stores/inventoryColumnStore';
	import ColumnsIcon from '$lib/icons/ColumnsIcon.svelte';
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte';
	import ResetIcon from '$lib/icons/ResetIcon.svelte';
	import CheckIcon from '$lib/icons/CheckIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

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

	let activeTab = $state('columns'); // 'columns' or 'scan'
</script>

<Dialog title="Inventar Filter">
	<div slot="content" class="flex flex-col gap-4">
		<!-- Tabs -->
		<div class="flex border-b border-gray-200">
			<button
				class="py-2 px-4 font-medium text-sm transition-colors relative {activeTab === 'columns'
					? 'text-thw-700'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeTab = 'columns')}
			>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4">
						<ColumnsIcon />
					</div>
					Spalten
				</div>
				{#if activeTab === 'columns'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-thw-700"></div>
				{/if}
			</button>
			<button
				class="py-2 px-4 font-medium text-sm transition-colors relative {activeTab === 'scan'
					? 'text-thw-700'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeTab = 'scan')}
			>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4">
						<CalendarIcon />
					</div>
					Scan Filter
				</div>
				{#if activeTab === 'scan'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-thw-700"></div>
				{/if}
			</button>
		</div>

		{#if activeTab === 'columns'}
			<!-- Columns Tab -->
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center mb-1">
					<h3 class="font-medium text-gray-800 text-sm">Sichtbare Spalten</h3>
					<button
						class="text-xs bg-thw-50 text-thw-600 px-2 py-0.5 rounded hover:bg-thw-100 transition-colors flex items-center gap-1"
						onclick={resetVisibleInventoryColumns}
					>
						<div class="w-3 h-3">
							<ResetIcon />
						</div>
						Zurücksetzen
					</button>
				</div>

				<div class="grid grid-cols-2 gap-2 pr-1">
					{#each columns as column}
						<div class="bg-gray-50 rounded px-2 py-1.5 flex items-center justify-between">
							<span class="text-xs text-gray-700 truncate mr-1">{column.label}</span>
							<Toggle
								checked={visibleColumns.includes(column.id)}
								on:change={() => onToggleColumn(column.id)}
								disabled={visibleColumns.length === 1 && visibleColumns.includes(column.id)}
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Scan Filter Tab -->
			<div class="flex flex-col gap-4">
				<div class="flex justify-between items-center">
					<h3 class="font-medium text-gray-800">Scan-Datum Filter</h3>
					<button
						class="text-xs bg-thw-50 text-thw-600 px-2 py-1 rounded hover:bg-thw-100 transition-colors flex items-center gap-1"
						onclick={() => {
							onLastScanFilterChange('after', '');
							onLastScanFilterChange('before', '');
							onLastScanFilterChange('never', 'false');
						}}
					>
						<div class="w-3 h-3">
							<ResetIcon />
						</div>
						Zurücksetzen
					</button>
				</div>

				<div class="bg-thw-50 rounded-lg p-4 mb-2">
					<div class="flex items-center gap-3">
						<Toggle
							checked={lastScanNever === 'true'}
							on:change={() =>
								onLastScanFilterChange('never', lastScanNever === 'true' ? 'false' : 'true')}
						/>
						<div>
							<div class="font-medium text-sm text-thw-800">Nur Items ohne Scan anzeigen</div>
							<div class="text-xs text-gray-600 mt-0.5">
								Zeigt nur Inventar-Items, die noch nie gescannt wurden
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="flex flex-col gap-1">
						<label class="text-sm font-medium text-gray-700">Letzter Scan nach</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<div class="w-4 h-4 text-gray-400">
									<CalendarIcon />
								</div>
							</div>
							<input
								type="date"
								class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-thw-500 focus:border-thw-500 text-sm"
								value={lastScanAfter}
								oninput={(e) => handleDateChange('after', e)}
								disabled={lastScanNever === 'true'}
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm font-medium text-gray-700">Letzter Scan vor</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<div class="w-4 h-4 text-gray-400">
									<CalendarIcon />
								</div>
							</div>
							<input
								type="date"
								class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-thw-500 focus:border-thw-500 text-sm"
								value={lastScanBefore}
								oninput={(e) => handleDateChange('before', e)}
								disabled={lastScanNever === 'true'}
							/>
						</div>
					</div>
				</div>

				{#if lastScanAfter || lastScanBefore || lastScanNever === 'true'}
					<div class="mt-2 bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800">
						<div class="flex items-start gap-2">
							<div class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
								<InfoIcon />
							</div>
							<div>
								<span class="font-medium">Aktive Filter:</span>
								<ul class="mt-1 ml-4 list-disc text-xs">
									{#if lastScanNever === 'true'}
										<li>Nur Items ohne Scan</li>
									{:else}
										{#if lastScanAfter}
											<li>
												Letzter Scan nach: {new Date(lastScanAfter).toLocaleDateString('de-DE')}
											</li>
										{/if}
										{#if lastScanBefore}
											<li>
												Letzter Scan vor: {new Date(lastScanBefore).toLocaleDateString('de-DE')}
											</li>
										{/if}
									{/if}
								</ul>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div slot="footer" class="flex justify-end w-full">
		<Button click={onClose}>
			<span class="flex items-center gap-2 text-white">
				<div class="w-4 h-4">
					<CheckIcon />
				</div>
				Übernehmen
			</span>
		</Button>
	</div>
</Dialog>
