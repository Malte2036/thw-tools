<script>
	import LinkButton from '$lib/LinkButton.svelte';
</script>

<svelte:head>
	<title>THW Tools - Impressum</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-col gap-8 mx-4">
	<div class="flex flex-col gap-4">
		<h1 class="text-4xl font-bold">Impressum</h1>
		<span>
			Diese Website ist ein privates Projekt und hat keinerlei direkte Verbindung zum Technischen
			Hilfswerk (THW). Das Logo des THWs, der Zahnkranz, wird ausschließlich zu dekorativen Zwecken
			auf der Website verwendet.
		</span>
		<span>
			Ich übernehme keine Haftung für die Richtigkeit der Inhalte dieser Website. Die Inhalte werden
			nach bestem Wissen und Gewissen erstellt. Für Hinweise auf Fehler bin ich dankbar.
		</span>
		<span>
			Die Fragen des <span class="italic">AGT-Quiz</span> stammen von der
			<a
				href="https://www.nlbk.niedersachsen.de/startseite/service/download/ausbildung_nach_fwdv_2/kreisausbildung/lehrgang_atemschutzgeratetrager/downloadbereich-lehrgang-atemschutzgeraetetraeger-86208.html"
				target="_blank"
				rel="noreferrer"
			>
				Niedersächsischen Akademie für Brand- und Katastrophenschutz</a
			>.
		</span>
		<span
			>Diese Seite verfügt über kein Impressum nach deutschem Recht: Ein Impressum gemäß § 5 TMG ist
			nicht erforderlich, da es sich nicht um einen geschäftsmäßigen Dienst, sondern um eine private
			Seite handelt. Auf dieser Seite werden keine journalistisch-redaktionellen Inhalte
			veröffentlicht, sodass ein Impressum nach § 55 RstV ebenfalls nicht erforderlich ist.</span
		>
		<span
			>Außerdem möchte ich darauf hinweisen, dass diese Website anonyme Nutzungsstatistiken sammelt.</span
		>
		<span
			>Für Fragen und Hinweise können Sie mich (Malte Sehmer) über die E-Mail-Adresse
			<a href="mailto:webmaster@thw-tools.de">webmaster@thw-tools.de</a> oder über
			<a href="https://app.thw-messenger.de/thw/app#/contacts/profile/1990855" target="_blank"
				>Hermine</a
			> (Malte Sehmer) erreichen</span
		>
		<span>
			Der Quellcode der Webseiten <a href="https://thw-tools.de" target="_blank" rel="noreferrer"
				>thw-tools.de</a
			>,
			<a href="https://finnentest.thw-tools.de" target="_blank" rel="noreferrer"
				>finnentest.thw-tools.de</a
			>
			und
			<a href="https://elektro.thw-tools.de" target="_blank" rel="noreferrer"
				>elektro.thw-tools.de</a
			>
			ist auf GitHub unter den Links
			<a href="https://github.com/Malte2036/thw-tools" target="_blank" rel="noreferrer"
				>https://github.com/Malte2036/thw-tools</a
			>
			<a href="https://github.com/Malte2036/thw-finnentest" target="_blank" rel="noreferrer"
				>https://github.com/Malte2036/thw-finnentest</a
			>
			und
			<a href="https://github.com/Malte2036/thw-elektro" target="_blank" rel="noreferrer"
				>https://github.com/Malte2036/thw-elektro</a
			>
			einsehbar. Der Quellcode des Backends ist auf GitHub unter

			<a href="https://github.com/Malte2036/thw-tools-backend" target="_blank" rel="noreferrer"
				>https://github.com/Malte2036/thw-tools-backend</a
			> einsehbar.
		</span>
	</div>

	<LinkButton url="/" secondary>Zurück</LinkButton>
</div>

<style>
	a {
		@apply text-thw underline;
	}
</style>
