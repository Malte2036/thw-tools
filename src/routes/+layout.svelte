<script>
	import '../app.css';
	import { page } from '$app/stores';
</script>

<div class="flex flex-col gap-4 justify-between min-h-screen">
	<div>
		<slot />
	</div>
	<div class="flex flex-row justify-center gap-2 mb-3">
		<div>©2023 Malte Sehmer</div>
		<div class="text-gray-400">|</div>
		<a href={$page.route.id === '/impressum' ? '/' : '/impressum'} class="underline">Impressum</a>
	</div>
</div>
