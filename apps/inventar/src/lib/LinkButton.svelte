<script lang="ts">
	import Button from './Button.svelte';

	export let url: string;
	export let blank = false;
	export let secondary = false;
	export let disabled = false;
</script>

<a
	href={url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class="w-full h-full"
	tabindex="-1"
>
	<Button {secondary} {disabled}>
		<slot />
	</Button>
</a>
