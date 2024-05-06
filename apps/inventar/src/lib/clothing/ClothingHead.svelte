<script lang="ts">
	import type { ClothingSizesTable } from './clothing';
	import { clothingNameToClothingType, clothingNameToFriendlyName } from './clothingUtils';

	export let table: ClothingSizesTable | undefined = undefined;
	let title = `THW-Tools: ${
		table ? clothingNameToFriendlyName(table.name) + ' - ' : ''
	}MEA Bekleidungsrechner`;

	const description = `Berechne deine passende Größe für die neue THW MEA-Bekleidung.${
		table ? ` ${clothingNameToFriendlyName(table.name)}:` : ''
	} Gebe deine Körpermaße ein und erhalte deine passende Größe.`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp"
	/>
	<meta property="og:locale" content="de_DE" />
	<meta
		name="keywords"
		content={`THW, Tools, MEA, Bekleidung, Größe, Rechner, Einsatzanzug, THW-Tools, THW-Tools.de${
			table
				? `, ${table.gender == 'M' ? 'Mann' : 'Frau'},${clothingNameToFriendlyName(table.name)}, ${table.type}`
				: ''
		}`}
	/>
</svelte:head>
