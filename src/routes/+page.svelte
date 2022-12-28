<script>
	import LinkButton from './LinkButton.svelte';
</script>

<svelte:head>
	<title>THW Tools</title>
	<meta
		name="description"
		content="Ein paar inoffizielle Tools für die Nutzung im THW! Unteranderem, ein AGT-Quiz und eine Anwendung zum tracken des Finnentests für Atemschutzgeräteträger."
	/>
</svelte:head>

<div class="flex flex-col gap-4 mx-auto h-full items-center justify-between py-4">
	<div class="flex flex-col gap-6 items-center mt-8 px-12 w-full max-w-md">
		<img src="THW.svg" class="w-32" width="128" height="128" alt="thw image" />
		<h1 class="w-fit text-4xl font-bold">THW Tools</h1>
		<h2 class="w-fit text-center">Ein paar inoffizielle Tools für die Nutzung im THW!</h2>
		<div class="w-full flex flex-col items-center gap-4 md:max-w-[16rem]">
			<LinkButton name="AGT-Quiz" url="https://agt.codelam.de" />
			<LinkButton name="Finnentest" url="https://finnentest.codelam.de" />
		</div>
	</div>
	<div>©2022 Malte Sehmer</div>
</div>
