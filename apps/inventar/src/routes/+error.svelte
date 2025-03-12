<script>
	import { page } from '$app/stores';
</script>

<div class="h-full flex flex-col items-center gap-4 m-4">
	<h1 class="text-3xl font-bold">{$page.status} Not Found</h1>
	<h2 class="text-2xl">{$page.error != null ? $page.error.message : 'Unknown Error'}</h2>
</div>
