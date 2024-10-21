<script lang="ts">
	import { trackEvent } from './utils';

	interface Props {
		secondary?: boolean;
		disabled?: boolean;
		click?: (() => void) | undefined;
		dataUmamiEvent?: string | undefined;
		tooltip?: string | undefined;
		size?: 'small' | 'medium' | 'large';
		children?: import('svelte').Snippet;
	}

	let {
		secondary = false,
		disabled = false,
		click = undefined,
		dataUmamiEvent = undefined,
		tooltip = undefined,
		size = 'medium',
		children
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="group relative">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<thw-button
		onclick={async () => {
			if (click) click();
			trackEvent(dataUmamiEvent);
		}}
		{disabled}
		type={secondary ? 'secondary' : 'primary'}
		{size}
	>
		{@render children?.()}
	</thw-button>
	{#if tooltip}
		<span
			class="pointer-events-none absolute bottom-auto left-1/2 transform -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-thw-500 text-white rounded-lg p-1 mt-1"
		>
			{tooltip}
		</span>
	{/if}
</div>
