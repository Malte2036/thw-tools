<script>
	/**
	 * @type {string}
	 */
	export let url;
</script>

<a
	href={url}
	target="_blank"
	rel="noreferrer"
	class="flex flex-row items-center justify-center gap-2 bg-thw text-white w-full py-2 rounded-lg text-xl font-bold"
>
	<slot />
</a>
