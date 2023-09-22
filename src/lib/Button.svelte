<script lang="ts">
	import { trackEvent } from './utils';

	export let secondary = false;
	export let disabled = false;
	export let click: (() => void) | undefined = undefined;
	export let dataUmamiEvent: string | undefined = undefined;
	export let tooltip: string | undefined = undefined;

	export let size: 'big' | 'normal' | 'small' = 'big';
</script>

<div class="group relative">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<thw-button
		on:click={async () => {
			if (click) click();
			trackEvent(dataUmamiEvent);
		}}
		{disabled}
		type={secondary ? 'secondary' : 'primary'}
		{size}
	>
		<slot />
	</thw-button>
	{#if tooltip}
		<span
			class="pointer-events-none absolute bottom-auto left-1/2 transform -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-thw-500 text-white rounded-lg p-1 mt-1"
		>
			{tooltip}
		</span>
	{/if}
</div>
