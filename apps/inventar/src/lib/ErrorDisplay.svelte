<script lang="ts">
	export let label: string;
	export let error: Error | null = null;
</script>

<thw-error-display {label} {error} />
