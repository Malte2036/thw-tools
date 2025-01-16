<script lang="ts">
	export let progress: number;
</script>

<div class="w-full h-2 bg-gray">
	<div
		class="h-full bg-thw rounded-r-full transition-[width] duration-300"
		style="width: {progress * 100}%"
	></div>
</div>
