<script lang="ts">
	interface Props {
		title: string;
		children?: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-xl font-bold">{title}</h2>
	<div class="bg-gray-50 p-4 rounded-lg">
		{@render children?.()}
	</div>
</div>
