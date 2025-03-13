<script lang="ts">
	interface Props {
		text: string;
		links?: { href: string; text: string; title: string; external?: boolean }[];
	}

	let { text, links = [] }: Props = $props();

	// Replace {{link}} placeholders with indexed versions {{0}}, {{1}}, etc.
	let processedText = $derived(links?.reduce(
		(text, _, index) => text.replace('{{link}}', `{{${index}}}`),
		text
	));
	console.log('links', links);
</script>

{#each processedText.split(/\{\{(\d+)\}\}/) as part, i}
	{#if i % 2 === 0}
		{part}
	{:else}
		{@const link = links[parseInt(part)]}
		<a
			href={link.href}
			class="text-thw underline"
			title={link.title}
			target={link.external ? '_blank' : undefined}
			rel={link.external ? 'noopener' : undefined}
		>
			{link.text}
		</a>
	{/if}
{/each}
