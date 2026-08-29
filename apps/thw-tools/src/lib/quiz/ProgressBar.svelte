<script lang="ts">
	interface Props {
		progress: number;
	}

	let { progress }: Props = $props();
</script>

<div
	class="h-2 w-full overflow-hidden rounded-full bg-thw-100"
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={Math.round(progress * 100)}
>
	<div
		class="h-full rounded-full bg-thw transition-[width] duration-300 ease-out"
		style="width: {progress * 100}%"
	></div>
</div>
