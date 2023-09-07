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
	<div class="w-full bg-thw text-white p-2 rounded-lg flex flex-row justify-between items-center">
		<p>{$bannerMessage}</p>
		<Button secondary className="w-min py-1" click={dismissAlert}>Schliessen</Button>
	</div>
{/if}
