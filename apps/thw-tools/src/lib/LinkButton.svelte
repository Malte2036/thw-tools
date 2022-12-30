<script lang="ts">
	export let url: string;
	export let blank: boolean = false;
</script>

<a
	href={url}
	target={blank ? '_blank' : undefined}
	rel={blank ? 'noreffer' : undefined}
	class="flex flex-row items-center justify-center gap-2 bg-thw text-white w-full py-2 rounded-lg text-xl font-bold"
>
	<slot />
</a>
