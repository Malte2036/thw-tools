<script lang="ts">
	import Button from './Button.svelte';
	import { trackEvent } from './utils';

	export let url: string;
	export let blank = false;
	export let secondary = false;
	export let disabled = false;
	export let dataUmamiEvent: string | undefined = undefined;
</script>

<a
	href={url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class="w-full h-full"
	tabindex="-1"
	on:click={() => trackEvent(dataUmamiEvent)}
>
	<Button {secondary} {disabled}>
		<slot />
	</Button>
</a>
