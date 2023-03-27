<script>
	import ChartSimpleIcon from '../lib/icons/ChartSimpleIcon.svelte';
	import HearthPulseIcon from '../lib/icons/HearthPulseIcon.svelte';
	import LinkButton from '../lib/LinkButton.svelte';
	import logo from '$lib/icons/thw-mzgw.webp';

	const description =
		'Ein paar inoffizielle Tools für die Nutzung im THW! Unter anderem, ein AGT-Quiz und eine Anwendung zum tracken des Finnentests für Atemschutzgeräteträger.';
</script>

<svelte:head>
	<title>THW Tools</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="flex flex-col gap-4 mx-auto h-full items-center justify-between mt-16 max-md:mt-8 py-4">
	<div class="flex flex-col gap-8 items-center px-12 w-full max-w-4xl">
		<img
			src={logo}
			class="w-96 max-md:w-64 aspect-auto"
			width="384"
			height="308.42"
			alt="THW MehrzweckGerätewagen"
		/>
		<h1 class="w-fit text-5xl max-md:text-4xl font-bold">THW Tools</h1>
		<h2 class="w-fit text-2xl max-md:text-lg text-center">
			{description}
		</h2>
		<div class="w-full flex flex-col items-center gap-4 max-w-sm max-md:max-w-[16rem]">
			<LinkButton url="/quiz/agt">
				<div class="w-6">
					<ChartSimpleIcon />
				</div>
				<div>AGT-Quiz</div>
			</LinkButton>
			<LinkButton url="/quiz/cbrn">
				<div class="w-6">
					<ChartSimpleIcon />
				</div>
				<div>CBRN-Quiz</div>
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

{#each ['agt', 'cbrn'] as questionType}
	<!-- svelte-ignore a11y-missing-content -->
	<a href={`/quiz/${questionType}/listing`} />
{/each}
