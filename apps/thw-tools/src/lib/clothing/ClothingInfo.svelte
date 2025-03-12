<script>
	import { clothingNameToFriendlyName } from './clothingConstantUtils';
</script>

<div class="px-8">
	<span class="font-bold">Info:</span>
	<ul class="list-disc">
		<li>
			Die fettgedruckten Maße im Ergebnis eines Kleidungsstücks sind zwingend notwendig für die
			Größenberechnung.
		</li>
		<li>Die anderen (nicht dickgedruckten) Maße fließen nicht in die Berechnung der Größe ein.</li>
		<li>
			Die Angabe "Abweichung" gibt an, wie stark die Maße von den eingegebenen Maßen abweichen. Eine
			Abweichung von 0 bedeutet, dass die Maße exakt übereinstimmen. Falls die Abweichung größer als
			0 ist, kann es sein, dass die Kleidung nicht optimal passt, und man sich für eine
			"Nachbargröße" entscheiden sollte (siehe "Weitere Ergebnisse anzeigen").
		</li>
		<li>
			Die Berechnung basiert grundlegend auf der <a
				href="https://en.wikipedia.org/wiki/Joint_European_standard_for_size_labelling_of_clothes#EN_13402-2:_Primary_and_secondary_dimensions"
				target="_blank"
				rel="noreferrer"
				class="text-thw underline">EN 13402</a
			>. Es wurden jedoch einige Anpassungen vorgenommen, um die Ergebnisse zu optimieren.
			Beispielsweise sollte die
			{clothingNameToFriendlyName('EA_U')}, falls es keine passende Größe gibt, eher etwas länger
			als zu kurz sein.
		</li>
	</ul>
</div>

<img src="/clothing/measurement.png" alt="Größentabelle" class="w-full md:w-1/2 mx-auto" />
