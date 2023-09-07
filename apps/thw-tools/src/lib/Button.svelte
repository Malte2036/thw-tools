<script lang="ts">
	export let secondary = false;
	export let disabled = false;
	export let click: (() => void) | undefined = undefined;
	export let dataUmamiEvent: string | undefined = undefined;
	export let className: string = '';
	export let tooltip: string | undefined = undefined;
</script>

<div class="group relative">
	<button
		on:click={async () => {
			if (click) click();
			if (umami) await umami.track(dataUmamiEvent);
		}}
		class={`flex flex-row items-center justify-center gap-2 bg-thw text-white border-thw hover:bg-thw-900 focus:bg-thw-900 w-full p-2 rounded-lg text-xl font-bold border transition-colors duration-75 ${className}`}
		class:secondary
		class:disabled
		{disabled}
	>
		<slot />
	</button>
	{#if tooltip}
		<span
			class="pointer-events-none absolute bottom-auto left-1/2 transform -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-thw-500 text-white rounded-lg p-1 mt-1"
		>
			{tooltip}
		</span>
	{/if}
</div>

<style lang="scss">
	button {
		&:not([disabled]) {
			@apply disabled:bg-white disabled:border-thw disabled:text-gray-500;
		}
		&:disabled {
			@apply bg-white border-thw text-gray-500;
		}
		&.secondary {
			@apply bg-white text-thw hover:bg-thw-100;
		}
	}
</style>
