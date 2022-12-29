<script>
	import '../app.css';
</script>

<div class="flex flex-col justify-between h-full">
	<slot />
	<div class="flex flex-row justify-center gap-2">
		<div>©2022 Malte Sehmer</div>
		<div class="text-gray-400">|</div>
		<a href="/impressum" class="underline">Impressum</a>
	</div>
</div>
