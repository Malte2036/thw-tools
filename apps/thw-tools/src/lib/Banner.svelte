<script>
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import Button from './Button.svelte';

	let show = false;

	function dismissAlert() {
		show = false;
	}

	bannerMessage.subscribe((value) => {
		if (value !== '') {
			show = true;
		}
	});
</script>

{#if show}
	<div
		class="absolute m-4 right-0 bg-thw text-white border-white border-2 p-2 rounded-lg flex flex-row gap-4 justify-between items-center z-50"
	>
		<p>{$bannerMessage}</p>
		<Button secondary className="w-min py-1 max-sm:text-sm" click={dismissAlert}>Schliessen</Button>
	</div>
{/if}
