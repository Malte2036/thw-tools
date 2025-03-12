<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
	}

	let { label, value }: Props = $props();
</script>

<div>
	<span class="font-medium">{label}:</span>
	<span>{value}</span>
</div>
