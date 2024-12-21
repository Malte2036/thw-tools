<script lang="ts">
	import { onMount } from 'svelte';
	import { trackEvent } from './utils';
	import { fade } from 'svelte/transition';

	interface Props {
		click?: (() => void) | undefined;
		dataUmamiEvent?: string | undefined;
		children?: import('svelte').Snippet;
		visible?: boolean;
	}

	let { click, dataUmamiEvent = undefined, children, visible = true }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

{#if visible && mounted}
	<button
		transition:fade={{ duration: 200 }}
		class="md:hidden fixed bottom-4 right-4 bg-thw text-white border-2 border-white hover:bg-thw-900 rounded-full h-16 w-16 p-4 z-50 flex items-center justify-center"
		onclick={async () => {
			if (click) click();
			trackEvent(dataUmamiEvent);
		}}
	>
		{@render children?.()}
	</button>
{/if}
