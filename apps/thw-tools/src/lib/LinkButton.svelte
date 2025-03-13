<script lang="ts">
	import Button from './Button.svelte';
	import { trackEvent } from './utils';

	interface Props {
		url: string | URL;
		blank?: boolean;
		secondary?: boolean;
		disabled?: boolean;
		dataUmamiEvent?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let {
		url,
		blank = false,
		secondary = false,
		disabled = false,
		dataUmamiEvent = undefined,
		children
	}: Props = $props();
</script>

<a
	href={url instanceof URL ? url.href : url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class="w-full h-full"
	tabindex="-1"
	onclick={() => trackEvent(dataUmamiEvent)}
>
	<Button {secondary} {disabled}>
		{@render children?.()}
	</Button>
</a>
