<script lang="ts">
	interface Props {
		label: string;
		error?: Error | null;
	}

	let { label, error = null }: Props = $props();
</script>

<thw-error-display {label} {error}></thw-error-display>
