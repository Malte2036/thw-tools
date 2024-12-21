<script lang="ts">
	import { trackEvent } from './utils';

	interface Props {
		click?: (() => void) | undefined;
		dataUmamiEvent?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { click, dataUmamiEvent = undefined, children }: Props = $props();
</script>

<button
	class="md:hidden fixed bottom-4 right-4 bg-thw text-white border-2 border-white hover:bg-thw-900 rounded-full h-16 w-16 p-4 z-50 flex items-center justify-center"
	onclick={async () => {
		if (click) click();
		trackEvent(dataUmamiEvent);
	}}
>
	{@render children?.()}
</button>
