<script lang="ts">
	import { trackEvent } from './utils';

	interface Props {
		click?: (() => void) | undefined;
		dataUmamiEvent?: string | undefined;
		children?: import('svelte').Snippet;
		visible?: boolean;
	}

	let { click, dataUmamiEvent = undefined, children, visible = true }: Props = $props();
</script>

{#if visible}
	<button
		class="
		md:hidden fixed bottom-4 right-4 bg-thw text-white border-2 border-white hover:bg-thw-900 rounded-full h-16 w-16 p-4 z-50 flex items-center justify-center
		motion-scale-in-[0.25] motion-blur-in-[10px] motion-delay-[0.25s]/blur
		"
		onclick={async () => {
			if (click) click();
			trackEvent(dataUmamiEvent);
		}}
	>
		{@render children?.()}
	</button>
{/if}
