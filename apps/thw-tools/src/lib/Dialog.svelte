<script lang="ts">
	interface Props {
		title: string;
		content?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { title, content, footer }: Props = $props();
</script>

<thw-dialog {title}>
	{@render content?.()}
	{@render footer?.()}
</thw-dialog>
