<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';

	export let title: string;
</script>

<div
	class="flex flex-row justify-between items-center w-full h-12 border-b-[1px] border-black mt-4 px-4 pb-4"
>
	<a href="/" class="flex flex-row gap-2 items-center">
		<div>
			<img src="../THW.svg" class="h-12 w-fit" width="128" height="128" alt="thw logo" />
		</div>
		<h1 class="text-4xl max-md:text-3xl max-sm:text-2xl font-bold">{title}</h1>
	</a>
	<div class="max-sm:hidden">
		<LinkButton url="/">Mehr THW Tools</LinkButton>
	</div>
</div>
