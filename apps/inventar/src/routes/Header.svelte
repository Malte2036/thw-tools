<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import HomeIcon from '$lib/icons/HomeIcon.svelte';
	import logo from '$lib/icons/thw-mzgw.webp';

	export let title: string;
</script>

<div
	class="flex flex-row justify-between items-center w-full h-12 border-b-[1px] border-black mt-4 px-4 pb-4"
>
	<a href="/" class="flex flex-row gap-2 items-center">
		<div>
			<img src={logo} class="h-12" alt="THW MehrzweckGerätewagen" />
		</div>
		<h1 class="text-4xl max-md:text-3xl max-sm:text-2xl font-bold hover:text-thw">{title}</h1>
	</a>
	<div>
		<LinkButton url="https://thw-tools.de" blank dataUmamiEvent={'Back to Main Page'}>
			<div class="flex flex-row gap-2 items-center justify-center">
				<HomeIcon />
				<div class="max-sm:hidden">Mehr THW Tools</div>
			</div>
		</LinkButton>
	</div>
</div>
