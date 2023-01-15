<script lang="ts">
	export let secondary = false;
	export let disabled = false;
	export let click: (() => void) | undefined = undefined;
</script>

<button
	on:click={click}
	class="flex flex-row items-center justify-center gap-2 bg-thw text-white border-thw hover:bg-thw-900 focus:bg-thw-900 w-full p-2 rounded-lg text-xl font-bold border transition-colors duration-75"
	class:secondary
	class:disabled
	{disabled}
>
	<slot />
</button>

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
