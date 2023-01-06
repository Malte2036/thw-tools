<script>
	import ChartSimpleIcon from '../lib/icons/ChartSimpleIcon.svelte';
	import HearthPulseIcon from '../lib/icons/HearthPulseIcon.svelte';
	import LinkButton from '../lib/LinkButton.svelte';
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
		<img src="thw-mzgw.png" class="w-64" width="248" alt="THW MehrzweckGerätewagen" />
		<h1 class="w-fit text-4xl font-bold">THW Tools</h1>
		<h2 class="w-fit text-center">Ein paar inoffizielle Tools für die Nutzung im THW!</h2>
		<div class="w-full flex flex-col items-center gap-4 md:max-w-[16rem]">
			<LinkButton url="/quiz/agt">
				<div class="w-6">
					<ChartSimpleIcon />
				</div>
				<div>AGT-Quiz</div>
			</LinkButton>
			<LinkButton url="https://finnentest.thw-tools.de" blank>
				<div class="w-6">
					<HearthPulseIcon />
				</div>
				<div>Finnentest</div>
			</LinkButton>
		</div>
	</div>
</div>
