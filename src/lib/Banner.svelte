<script lang="ts">
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import Button from './Button.svelte';

	let show = false;

	function dismissAlert() {
		show = false;
	}

	var dismissTimer: NodeJS.Timeout | undefined;

	bannerMessage.subscribe((value) => {
		if (value !== undefined && value?.message !== '') {
			if (dismissTimer !== undefined) {
				clearTimeout(dismissTimer);
			}

			show = true;

			if (value.autoDismiss) {
				dismissTimer = setTimeout(() => {
					dismissAlert();
				}, value.autoDismiss.duration);
			}
		}
	});
</script>

{#if show}
	<div
		class="fixed m-4 right-0 bg-thw text-white border-white border-2 p-2 rounded-lg flex flex-row gap-4 justify-between items-center z-50"
	>
		<p>{@html $bannerMessage?.message}</p>
		<Button secondary size={'small'} click={dismissAlert}>Schliessen</Button>
	</div>
{/if}
