<script lang="ts">
	import Button from './Button.svelte';

	export let url: string;
	export let blank = false;
	export let secondary = false;
	export let disabled = false;
	export let additionalClass = '';
</script>

<a
	href={url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class={`w-full h-full ${additionalClass}`}
	tabindex="-1"
>
	<Button {secondary} {disabled}>
		<slot />
	</Button>
</a>
