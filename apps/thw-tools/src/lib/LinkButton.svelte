<script lang="ts">
	export let url: string;
	export let blank = false;
	export let secondary = false;
</script>

<a
	href={url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class="flex flex-row items-center justify-center gap-2 bg-thw text-white w-full p-2 rounded-lg text-xl font-bold border"
	class:bg-white={secondary}
	class:text-thw={secondary}
	class:border-thw={secondary}
>
	<slot />
</a>
