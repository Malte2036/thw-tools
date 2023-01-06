<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import logo from '$lib/icons/thw-mzgw.webp';

	export let title: string;
</script>

<div
	class="flex flex-row justify-between items-center w-full h-12 border-b-[1px] border-black mt-4 px-4 pb-4"
>
	<a href="/" class="flex flex-row gap-2 items-center">
		<div>
			<img src={logo} class="h-12 w-fit" height="59.75" width="48" alt="THW MehrzweckGerätewagen" />
		</div>
		<h1 class="text-4xl max-md:text-3xl max-sm:text-2xl font-bold hover:text-thw">{title}</h1>
	</a>
	<div class="max-sm:hidden">
		<LinkButton url="/">Mehr THW Tools</LinkButton>
	</div>
</div>
