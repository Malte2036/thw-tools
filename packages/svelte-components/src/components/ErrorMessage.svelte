<script lang="ts">
	interface Props {
		message: string | null | undefined;
	}

	let { message }: Props = $props();
</script>

{#if message}
	<div class="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md" role="alert">
		{message}
	</div>
{/if} 