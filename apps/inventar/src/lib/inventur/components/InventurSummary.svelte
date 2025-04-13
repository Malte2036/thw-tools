<script lang="ts">
	interface Props {
		expectedTotalCount: number;
		scannedUniqueCount: number;
		scannedTotalCount: number;
		missingCount: number;
	}
	let { expectedTotalCount, scannedUniqueCount, scannedTotalCount, missingCount }: Props = $props();
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
	<div>
		<div class="text-sm text-gray-500">Erwartet</div>
		<div class="text-2xl font-bold">{expectedTotalCount}</div>
	</div>
	<div>
		<div class="text-sm text-gray-500">Gescannte Positionen</div>
		<div class="text-2xl font-bold">{scannedUniqueCount}</div>
	</div>
	<div>
		<div class="text-sm text-gray-500">Gesamt gezählt</div>
		<div class="text-2xl font-bold">{scannedTotalCount}</div>
	</div>
	<div>
		<div class="text-sm text-gray-500">Fehlend</div>
		<div class="text-2xl font-bold text-orange-600">{missingCount}</div>
	</div>
</div>
