<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		content?: Snippet;
		footer?: Snippet;
	}

	let { title, content, footer }: Props = $props();
</script>

<thw-dialog {title}>
	<div slot="content">
		{@render content?.()}
	</div>
	<div slot="footer">
		{@render footer?.()}
	</div>
</thw-dialog>
