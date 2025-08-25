<script lang="ts">
	import { Table, Button } from '@thw-tools/svelte-components';
	import { dateToFriendlyString } from '@thw-tools/shared';
	import type { PageData } from './$types';
	import QRScanner from '$lib/funk/QRScanner.svelte';
	import ManualMaterialModal from '$lib/components/missions/ManualMaterialModal.svelte';
	import MaterialStatusModal from '$lib/components/missions/MaterialStatusModal.svelte';
	import StatusBadge from '$lib/components/missions/StatusBadge.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let { data }: { data: PageData } = $props();
	let mission = data.mission; // The prop is already reactive

	// State for modals
	let showManualModal = $state(false);
	let showStatusModalFor = $state<any>(null); // Will hold the material object

	// Reactive declarations to format data for the table
	const header = ['Gegenstand', 'Status', 'Ausgegeben am', 'Zurück am'];
	let values = $derived(
		mission.materials?.map((mat) => [
			mat.inventoryItem
				? mat.inventoryItem.ausstattung
				: `${mat.manualName} (${mat.manualQuantity} ${mat.manualUnit})`,
			mat.status,
			dateToFriendlyString(new Date(mat.checkedOutAt)),
			mat.returnedAt ? dateToFriendlyString(new Date(mat.returnedAt)) : '-'
		]) ?? []
	);

	// --- API Handlers ---
	// TODO: Replace mocks with actual calls to missions.service.ts

	async function handleScan(scannedId: string) {
		console.log('Scanned:', scannedId);
		// Mock API response for an item that is already checked out
		const mockApiResponse = { actionRequired: true, missionMaterialId: 'mat1' };

		if (mockApiResponse.actionRequired) {
			const materialToUpdate = mission.materials.find(
				(m) => m.id === mockApiResponse.missionMaterialId
			);
			showStatusModalFor = materialToUpdate;
		} else {
			// Add new item to the list
			// mission.materials = [newItem, ...mission.materials];
			$bannerMessage = {
				message: 'Gegenstand erfolgreich erfasst!',
				type: 'info',
				autoDismiss: { duration: 3000 }
			};
		}
	}

	async function handleAddManual(data: { name: string; quantity: number; unit: string }) {
		console.log('Adding manual item:', data);
		// Mock API call
		const newItem = {
			id: 'mat' + Date.now(),
			manualName: data.name,
			manualQuantity: data.quantity,
			manualUnit: data.unit,
			status: 'CHECKED_OUT',
			checkedOutAt: new Date()
		};
		mission.materials = [newItem, ...mission.materials];
		$bannerMessage = {
			message: 'Gegenstand erfolgreich hinzugefügt!',
			type: 'info',
			autoDismiss: { duration: 3000 }
		};
	}

	async function handleUpdateStatus(status: string) {
		console.log(`Updating item ${showStatusModalFor.id} to ${status}`);
		// Mock API call
		const index = mission.materials.findIndex((m) => m.id === showStatusModalFor.id);
		if (index !== -1) {
			mission.materials[index].status = status;
			mission.materials[index].returnedAt = new Date();
		}
		$bannerMessage = {
			message: 'Status erfolgreich aktualisiert!',
			type: 'info',
			autoDismiss: { duration: 3000 }
		};
	}
</script>

<div class="container mx-auto p-4">
	<!-- Mission Header -->
	<div class="bg-white shadow rounded-lg p-6 mb-6">
		<div class="flex justify-between items-start">
			<div>
				<h1 class="text-3xl font-bold">{mission.name}</h1>
				<p class="text-lg text-gray-600">{mission.location}</p>
			</div>
			<StatusBadge status={mission.status as any} />
		</div>
		{#if mission.description}
			<p class="mt-4 text-gray-700">{mission.description}</p>
		{/if}
	</div>

	<!-- Action Buttons & Scanner -->
	<div class="mb-6">
		<QRScanner onScan={handleScan} />
	</div>
	<Button click={() => (showManualModal = true)} type="secondary">Manuell hinzufügen</Button>

	<!-- Material List -->
	<div class="bg-white shadow rounded-lg mt-6">
		<h2 class="text-xl font-bold p-4 border-b">Materialliste</h2>
		{#if values.length > 0}
			<Table {header} {values} />
		{:else}
			<p class="p-8 text-center text-gray-500">
				Für diesen Einsatz wurde noch kein Material erfasst.
			</p>
		{/if}
	</div>
</div>

<!-- Modals -->
{#if showManualModal}
	<ManualMaterialModal onClose={() => (showManualModal = false)} onSubmit={handleAddManual} />
{/if}

{#if showStatusModalFor}
	<MaterialStatusModal
		itemName={showStatusModalFor.inventoryItem?.ausstattung || showStatusModalFor.manualName}
		onClose={() => (showStatusModalFor = null)}
		onUpdate={handleUpdateStatus}
	/>
{/if}

<svelte:head>
	<title>{mission.name}</title>
</svelte:head>
