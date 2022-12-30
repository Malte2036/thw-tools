<script>
	import LinkButton from '$lib/LinkButton.svelte';
</script>

<div class="m-4 flex flex-col gap-4">
	<div class="w-fit">
		<LinkButton url="/" secondary>Mehr THW Tools</LinkButton>
	</div>

	<slot />
</div>
