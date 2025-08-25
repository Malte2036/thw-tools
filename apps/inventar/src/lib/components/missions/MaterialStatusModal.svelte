<script lang="ts">
	import { Dialog, Button } from '@thw-tools/svelte-components';
	import type { MaterialStatus } from '@prisma/client/inventory';

	interface Props {
		itemName: string;
		onClose: () => void;
		onUpdate: (status: MaterialStatus) => Promise<void>;
	}

	let { itemName, onClose, onUpdate }: Props = $props();
	let isLoading: MaterialStatus | null = null;

	async function handleUpdate(status: MaterialStatus) {
		isLoading = status;
		try {
			await onUpdate(status);
			onClose();
		} catch (e) {
			// Optional: show an error message
			console.error(e);
		} finally {
			isLoading = null;
		}
	}
</script>

<Dialog {onClose} title="Status aktualisieren">
	<div class="space-y-4">
		<p>
			Der Gegenstand "<strong>{itemName}</strong>" ist bereits ausgegeben. Welchen Status soll er
			erhalten?
		</p>

		<div class="flex flex-col gap-2 pt-4">
			<Button
				label="Als Zurück markieren"
				click={() => handleUpdate('RETURNED')}
				isLoading={isLoading === 'RETURNED'}
			/>
			<Button
				label="Als Defekt melden"
				variant="warning"
				click={() => handleUpdate('DEFECTIVE')}
				isLoading={isLoading === 'DEFECTIVE'}
			/>
			<Button
				label="Als Verlust melden"
				variant="danger"
				click={() => handleUpdate('LOST')}
				isLoading={isLoading === 'LOST'}
			/>
		</div>
	</div>
</Dialog>