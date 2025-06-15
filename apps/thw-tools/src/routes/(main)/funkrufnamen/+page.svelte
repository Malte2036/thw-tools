<script lang="ts">
	import { Input, Table, Select, Button, InfoBox } from '@thw-tools/svelte-components';
	import { onMount } from 'svelte';
	import {
		organizationCallSigns,
		thwUnits,
		vehiclePersonNumbers,
		examples,
		commonLocations
	} from './funkrufnamen-data';

	let searchTerm = $state('');
	let activeTab = $state(0);
	let activeToolTab = $state(0);

	// Generator states
	let generatorLocation = $state('');
	let generatorUnit = $state('');
	let generatorVehicle = $state('');
	let generatedCallsign = $state('');

	// Quick search states
	let quickSearchTerm = $state('');
	let quickSearchResults = $state<any[]>([]);

	// Decoder function
	function decodeCallsign(input: string) {
		const trimmed = input.trim().toUpperCase();

		// Pattern for full THW call signs: HEROS [Location] [Unit]/[Vehicle]
		const fullPattern = /^HEROS\s+([A-ZÄÖÜ\-\s]+)\s+(\d{1,2})(?:\/(\d{1,2}))?$/i;
		const fullMatch = trimmed.match(fullPattern);

		if (fullMatch) {
			const [, location, unitCode, vehicleCode] = fullMatch;
			const unit = thwUnits.find((u) =>
				Array.isArray(u.code) ? u.code.includes(unitCode) : u.code === unitCode
			);
			const vehicle = vehicleCode ? vehiclePersonNumbers.find((v) => v.code === vehicleCode) : null;

			return {
				valid: true,
				type: 'full',
				organization: 'Technisches Hilfswerk (THW)',
				organizationCode: 'HEROS',
				location: location.trim(),
				unitCode,
				unitDescription: unit?.unit || 'Unbekannte Einheit',
				vehicleCode,
				vehicleDescription:
					vehicle?.description || (vehicleCode ? 'Unbekanntes Fahrzeug/Person' : 'Einheit selbst'),
				fullDescription: `THW ${location.trim()}, ${unit?.unit || 'Unbekannte Einheit'}${vehicle ? `, ${vehicle.description}` : ''}`
			};
		}

		// Pattern for organization codes only
		const orgPattern =
			/^(HEROS|FLORIAN|ROTKREUZ|AKKON|PELIKAN|SAMA|JOHANNES|KATER|BERGWACHT|WASSERWACHT|CHRISTOPH)$/i;
		const orgMatch = trimmed.match(orgPattern);

		if (orgMatch) {
			const orgCode = orgMatch[1].toUpperCase();
			const org = organizationCallSigns.find((o) => o.tmo_dmo.toUpperCase() === orgCode);

			return {
				valid: true,
				type: 'organization',
				organization: org?.organization || 'Unbekannte Organisation',
				organizationCode: orgCode,
				fullDescription: org?.organization || 'Unbekannte Organisation'
			};
		}

		// Pattern for unit/vehicle codes only
		const unitVehiclePattern = /^(\d{1,2})(?:\/(\d{1,2}))?$/;
		const unitVehicleMatch = trimmed.match(unitVehiclePattern);

		if (unitVehicleMatch) {
			const [, unitCode, vehicleCode] = unitVehicleMatch;
			const unit = thwUnits.find((u) =>
				Array.isArray(u.code) ? u.code.includes(unitCode) : u.code === unitCode
			);
			const vehicle = vehicleCode ? vehiclePersonNumbers.find((v) => v.code === vehicleCode) : null;

			return {
				valid: true,
				type: 'unit_vehicle',
				unitCode,
				unitDescription: unit?.unit || 'Unbekannte Einheit',
				vehicleCode,
				vehicleDescription:
					vehicle?.description || (vehicleCode ? 'Unbekanntes Fahrzeug/Person' : 'Einheit selbst'),
				fullDescription: `${unit?.unit || 'Unbekannte Einheit'}${vehicle ? `, ${vehicle.description}` : ''}`
			};
		}

		return {
			valid: false,
			error: 'Ungültiges Rufzeichenformat'
		};
	}

	// Generator function
	function generateCallsign() {
		if (!generatorLocation || !generatorUnit) {
			return null;
		}

		const unit = thwUnits.find((u) =>
			Array.isArray(u.code) ? u.code.includes(generatorUnit) : u.code === generatorUnit
		);
		const vehicle = generatorVehicle
			? vehiclePersonNumbers.find((v) => v.code === generatorVehicle)
			: null;

		if (!unit) {
			return null;
		}

		return {
			callsign: `HEROS ${generatorLocation} ${generatorUnit}${vehicle ? `/${vehicle.code}` : ''}`,
			description: `THW ${generatorLocation}, ${unit.unit}${vehicle ? `, ${vehicle.description}` : ''}`
		};
	}

	// Quick search function
	function performQuickSearch() {
		if (!quickSearchTerm) {
			quickSearchResults = [];
			return;
		}

		const searchLower = quickSearchTerm.toLowerCase();
		const results = [];

		// Search in examples
		for (const example of examples) {
			if (
				example.description.toLowerCase().includes(searchLower) ||
				example.callsign.toLowerCase().includes(searchLower)
			) {
				results.push({
					type: 'example',
					...example
				});
			}
		}

		// Search in units
		for (const unit of thwUnits) {
			if (
				unit.unit.toLowerCase().includes(searchLower) ||
				(Array.isArray(unit.code)
					? unit.code.some((c) => c.includes(searchLower))
					: unit.code.includes(searchLower))
			) {
				results.push({
					type: 'unit',
					...unit
				});
			}
		}

		// Search in vehicles/persons
		for (const vehicle of vehiclePersonNumbers) {
			if (
				vehicle.description.toLowerCase().includes(searchLower) ||
				vehicle.code.includes(searchLower)
			) {
				results.push({
					type: 'vehicle',
					...vehicle
				});
			}
		}

		quickSearchResults = results;
	}

	// Convert reactive statements to $derived
	const generated = $derived(generateCallsign());
	$effect(() => {
		if (quickSearchTerm) {
			performQuickSearch();
		}
	});

	// Filter functions for tables
	function filterOrganizations(data: typeof organizationCallSigns) {
		if (!searchTerm) return data;
		return data.filter(
			(item) =>
				item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.tmo_dmo.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function filterThwUnits(data: typeof thwUnits) {
		if (!searchTerm) return data;
		return data.filter(
			(item) =>
				item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.number.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function filterVehiclePersonNumbers(data: typeof vehiclePersonNumbers) {
		if (!searchTerm) return data;
		return data.filter(
			(item) =>
				item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.number.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function filterExamples(data: typeof examples) {
		if (!searchTerm) return data;
		return data.filter(
			(item) =>
				item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.callsign.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	// Convert data to table format
	const filteredOrganizations = $derived(
		filterOrganizations(organizationCallSigns).map((item) => [item.organization, item.tmo_dmo])
	);

	const filteredThwUnits = $derived(
		filterThwUnits(thwUnits).map((item) => [item.unit, item.number])
	);

	const filteredVehiclePersonNumbers = $derived(
		filterVehiclePersonNumbers(vehiclePersonNumbers).map((item) => [item.description, item.number])
	);

	const filteredExamples = $derived(
		filterExamples(examples).map((item) => [item.description, item.callsign])
	);

	const tabs = $derived([
		{ label: 'Organisationen', count: filteredOrganizations.length },
		{ label: 'THW-Einheiten', count: filteredThwUnits.length },
		{ label: 'Fahrzeuge/Personen', count: filteredVehiclePersonNumbers.length },
		{ label: 'Beispiele', count: filteredExamples.length }
	]);

	const toolTabs = [
		{ label: 'Suche & Decoder', icon: '🔍' },
		{ label: 'Generator', icon: '⚙️' }
	];
</script>

<svelte:head>
	<title>THW Funkrufnamen Decoder & Generator - BOS-Funkrufzeichen</title>
	<meta
		name="description"
		content="Decodieren und Generieren von THW Funkrufnamen. Einfach Einheiten, Fahrzeuge und Personen identifizieren. Vollständige Übersicht aller BOS-Funkrufzeichen mit praktischen Tools zum Dekodieren und Erstellen von Funkrufnamen."
	/>
	<meta
		name="keywords"
		content="THW, Funkrufnamen, BOS-Funk, Rufzeichen, Heros, Sprechfunk, Kommunikation, Decoder, Generator, Funkrufzeichen, Einheiten, Fahrzeuge, Personen"
	/>
	<meta property="og:title" content="THW Funkrufnamen Decoder & Generator" />
	<meta
		property="og:description"
		content="Decodieren und Generieren von THW Funkrufnamen. Einfach Einheiten, Fahrzeuge und Personen identifizieren. Vollständige Übersicht aller BOS-Funkrufzeichen."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-white to-thw-50">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-thw-900 mb-4">THW Funkrufnamen</h1>
			<p class="text-lg text-gray-700 max-w-3xl mx-auto">
				Zur bundesweit einheitlichen Identifikation von THW-Einheiten im BOS-Funk werden
				einheitliche
				<strong>Funkrufnamen</strong> verwendet. Anhand des Funkrufnamens kann die Leitstelle oder die
				Führungsstelle im Einsatz erkennen, welchen taktischen Einsatzwert die Einheit hat.
			</p>
		</div>

		<!-- Tools Section -->
		<div class="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
			<div class="border-b border-gray-200 bg-thw-50">
				<div class="flex">
					{#each toolTabs as tab, index}
						<button
							class="px-6 py-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 {activeToolTab ===
							index
								? 'border-thw-600 text-thw-600 bg-white'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
							onclick={() => (activeToolTab = index)}
						>
							<span class="text-lg">{tab.icon}</span>
							{tab.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="p-6">
				{#if activeToolTab === 0}
					<!-- Combined Search & Decoder -->
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-bold text-thw-800 mb-2">Suche & Decoder</h3>
							<p class="text-gray-600 mb-4">
								Gib einen beliebigen Funkschnipsel („21/51", „Heros Bonn"), nur Einheit/Fahrzeug
								(„24/55") oder einen vollständigen Funkrufnamen („HEROS Düsseldorf 24/55") ein.
							</p>
						</div>

						<Input
							bind:inputValue={quickSearchTerm}
							placeholder="z.B. 21/51, Heros München, HEROS Düsseldorf 24/55..."
							label="Suchbegriff oder Funkrufname eingeben"
						/>

						<!-- Decoder Results (for full call signs or unit/vehicle codes) -->
						{#if quickSearchTerm.length >= 2 && (quickSearchTerm
								.toUpperCase()
								.startsWith('HEROS ') || /^\d{1,2}(\/\d{1,2})?$/.test(quickSearchTerm.trim()))}
							{@const decodedResult = decodeCallsign(quickSearchTerm)}
							{#if decodedResult.valid}
								<div class="bg-green-50 border border-green-200 rounded-lg p-4">
									<h4 class="font-semibold text-green-800 mb-3">🔓 Dekodierung erfolgreich:</h4>
									{#if decodedResult.type === 'full'}
										<div class="grid md:grid-cols-2 gap-4">
											<div class="space-y-2">
												<div>
													<span class="text-sm font-medium text-gray-600">Organisation:</span>
													<div class="font-mono text-sm bg-white p-2 rounded border">
														{decodedResult.organizationCode} = {decodedResult.organization}
													</div>
												</div>
												<div>
													<span class="text-sm font-medium text-gray-600">Dienststelle:</span>
													<div class="font-mono text-sm bg-white p-2 rounded border">
														{decodedResult.location}
													</div>
												</div>
											</div>
											<div class="space-y-2">
												<div>
													<span class="text-sm font-medium text-gray-600">Einheit:</span>
													<div class="font-mono text-sm bg-white p-2 rounded border">
														{decodedResult.unitCode} = {decodedResult.unitDescription}
													</div>
												</div>
												{#if decodedResult.vehicleCode}
													<div>
														<span class="text-sm font-medium text-gray-600">Fahrzeug/Person:</span>
														<div class="font-mono text-sm bg-white p-2 rounded border">
															{decodedResult.vehicleCode} = {decodedResult.vehicleDescription}
														</div>
													</div>
												{/if}
											</div>
										</div>
									{:else if decodedResult.type === 'organization'}
										<div class="space-y-2">
											<div>
												<span class="text-sm font-medium text-gray-600">Organisation:</span>
												<div class="font-mono text-sm bg-white p-2 rounded border">
													{decodedResult.organizationCode} = {decodedResult.organization}
												</div>
											</div>
										</div>
									{:else if decodedResult.type === 'unit_vehicle'}
										<div class="space-y-2">
											<div>
												<span class="text-sm font-medium text-gray-600">Einheit:</span>
												<div class="font-mono text-sm bg-white p-2 rounded border">
													{decodedResult.unitCode} = {decodedResult.unitDescription}
												</div>
											</div>
											{#if decodedResult.vehicleCode}
												<div>
													<span class="text-sm font-medium text-gray-600">Fahrzeug/Person:</span>
													<div class="font-mono text-sm bg-white p-2 rounded border">
														{decodedResult.vehicleCode} = {decodedResult.vehicleDescription}
													</div>
												</div>
											{/if}
										</div>
									{/if}
									<div class="mt-4 pt-4 border-t border-green-200">
										<div class="mb-2">
											<span class="text-sm font-medium text-gray-600">Beschreibung:</span>
											<div class="text-sm bg-white p-2 rounded border mt-1">
												{decodedResult.fullDescription}
											</div>
										</div>
									</div>
								</div>
							{:else}
								<div class="bg-red-50 border border-red-200 rounded-lg p-4">
									<h4 class="font-semibold text-red-800 mb-2">🔓 Dekodierung fehlgeschlagen:</h4>
									<p class="text-red-700 text-sm">{decodedResult.error}</p>
								</div>
							{/if}
						{/if}

						<!-- Quick Search Results -->
						{#if quickSearchResults.length > 0}
							<div class="space-y-2">
								<h4 class="font-semibold text-gray-800">🔍 Suchergebnisse:</h4>
								{#each quickSearchResults as result}
									<div
										class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
									>
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<div class="flex items-center gap-2 mb-1">
													<span
														class="text-xs px-2 py-1 bg-thw-100 text-thw-700 rounded-full font-medium"
													>
														{result.type === 'example'
															? 'Beispiel'
															: result.type === 'unit'
																? 'Einheit'
																: result.type === 'vehicle'
																	? 'Fahrzeug/Person'
																	: result.type}
													</span>
													<span class="font-mono text-sm font-bold text-thw-600">
														{result.type === 'example'
															? result.callsign
															: result.type === 'unit'
																? result.code
																: result.type === 'vehicle'
																	? result.code
																	: ''}
													</span>
												</div>
												<p class="text-gray-700 text-sm">
													{result.type === 'example'
														? result.description
														: result.type === 'unit'
															? result.unit
															: result.type === 'vehicle'
																? result.description
																: ''}
												</p>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else if quickSearchTerm.length >= 2 && !quickSearchTerm
								.toUpperCase()
								.startsWith('HEROS ') && !/^\d{1,2}(\/\d{1,2})?$/.test(quickSearchTerm.trim())}
							<div class="text-center py-8 text-gray-500">
								<p>Keine Treffer für "{quickSearchTerm}" gefunden.</p>
								<p class="text-sm mt-1">
									Versuche es mit anderen Begriffen wie Ortsnamen, Zahlencodes oder "Heros".
								</p>
							</div>
						{/if}
					</div>
				{:else if activeToolTab === 1}
					<!-- Generator -->
					<div class="space-y-4">
						<div>
							<h3 class="text-xl font-bold text-thw-800 mb-2">Funkrufnamen-Generator</h3>
							<p class="text-gray-600 mb-4">
								Gib den Ortsverband ein und wähle Einheit und optional ein Fahrzeug/Person aus, um
								einen vollständigen Funkrufnamen zu generieren.
							</p>
						</div>

						<div class="grid md:grid-cols-3 gap-4">
							<div>
								<Input
									bind:inputValue={generatorLocation}
									label="Ortsverband"
									placeholder="z.B. München, Berlin, Hamburg..."
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Einheit</label>
								<select
									bind:value={generatorUnit}
									class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-thw-500 focus:border-thw-500"
								>
									<option value="">Einheit wählen...</option>
									{#each thwUnits as unit}
										<option value={unit.code}>{unit.code} - {unit.unit}</option>
									{/each}
								</select>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2"
									>Fahrzeug/Person (optional)</label
								>
								<select
									bind:value={generatorVehicle}
									class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-thw-500 focus:border-thw-500"
								>
									<option value="">Fahrzeug/Person wählen...</option>
									{#each vehiclePersonNumbers as vehicle}
										<option value={vehicle.code}>{vehicle.code} - {vehicle.description}</option>
									{/each}
								</select>
							</div>
						</div>

						{#if generated}
							<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h4 class="font-semibold text-blue-800 mb-3">⚙️ Generierter Funkrufname:</h4>
								<div class="space-y-3">
									<div>
										<span class="text-sm font-medium text-gray-600">Funkrufname:</span>
										<div
											class="font-mono text-lg font-bold bg-white p-3 rounded border text-thw-600"
										>
											{generated.callsign}
										</div>
									</div>
									<div>
										<span class="text-sm font-medium text-gray-600">Beschreibung:</span>
										<div class="text-sm bg-white p-2 rounded border">
											{generated.description}
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Info Box -->
		<InfoBox title="Aufbau der THW-Funkrufnamen:" type="thw">
			<div class="space-y-1">
				<div><strong>1. Kennung für das THW:</strong> HEROS</div>
				<div><strong>2. Kennung der Dienststelle:</strong> Ortsname der THW-Dienststelle</div>
				<div><strong>3. Kennung der taktischen Einheit:</strong> 1. und 2. Ziffer</div>
				<div><strong>4. Kennung des Fahrzeugs/der Person:</strong> 3. und 4. Ziffer</div>
			</div>
			<p class="text-sm mt-3">
				<strong>Beispiel:</strong> HEROS Düsseldorf 24/55 = THW Düsseldorf, Fachgruppe Notversorgung/Notinstandsetzung
				im 1. TZ, Mehrzweckgerätewagen
			</p>
		</InfoBox>

		<!-- Reference Tables -->
		<div class="mb-6">
			<h2 class="text-2xl font-bold text-thw-800 mb-4">Referenz-Tabellen</h2>
			<Input bind:inputValue={searchTerm} placeholder="Suche in den Referenz-Tabellen..." />
		</div>

		<!-- Tabs -->
		<div class="bg-white rounded-lg shadow-md overflow-hidden">
			<div class="border-b border-gray-200 bg-gray-50">
				<div class="flex overflow-x-auto scrollbar-hide">
					{#each tabs as tab, index}
						<button
							class="px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap {activeTab ===
							index
								? 'border-thw-600 text-thw-600 bg-white'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
							onclick={() => (activeTab = index)}
						>
							{tab.label}
							<span class="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
								{tab.count}
							</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="p-6">
				{#if activeTab === 0}
					<!-- Organizations Table -->
					<div class="mb-4">
						<h3 class="text-xl font-bold text-thw-800 mb-2">Funkrufnamen der Organisationen</h3>
						<p class="text-gray-600 mb-4">
							Übersicht der Funkrufnamen aller BOS-Organisationen im TMO/DMO.
						</p>
					</div>
					<Table
						header={['Organisation', 'TMO/DMO & 4-Meter Band']}
						values={filteredOrganizations}
						height={500}
					/>
					<div class="mt-4 text-sm text-gray-500">
						<p>
							<strong>Hinweis:</strong> Polizeiliche BOS haben landesspezifisch unterschiedliche Funkrufnamen.
						</p>
					</div>
				{:else if activeTab === 1}
					<!-- THW Units Table -->
					<div class="mb-4">
						<h3 class="text-xl font-bold text-thw-800 mb-2">THW-Organisationseinheiten</h3>
						<p class="text-gray-600 mb-4">
							Kennnummern der verschiedenen THW-Einheiten für die Funkrufnamen-Bildung.
						</p>
					</div>
					<Table
						header={['Organisationseinheit', 'Kennnummer']}
						values={filteredThwUnits}
						height={500}
					/>
				{:else if activeTab === 2}
					<!-- Vehicle/Person Numbers Table -->
					<div class="mb-4">
						<h3 class="text-xl font-bold text-thw-800 mb-2">Fahrzeug- und Personenkennungen</h3>
						<p class="text-gray-600 mb-4">
							Kennnummern für Fahrzeuge und Personen in den THW-Einheiten.
						</p>
					</div>
					<Table
						header={['Beschreibung', 'Kennnummer']}
						values={filteredVehiclePersonNumbers}
						height={500}
					/>
				{:else if activeTab === 3}
					<!-- Examples Table -->
					<div class="mb-4">
						<h3 class="text-xl font-bold text-thw-800 mb-2">Beispiele für Funkrufnamen</h3>
						<p class="text-gray-600 mb-4">
							Praktische Beispiele für die Anwendung der Funkrufnamen-Regelung.
						</p>
					</div>
					<Table header={['Beschreibung', 'Funkrufname']} values={filteredExamples} height={500} />
				{/if}
			</div>
		</div>

		<!-- Footer Info -->
		<div class="mt-8 bg-gray-50 rounded-lg p-6">
			<h3 class="font-bold text-gray-800 mb-3">Wichtige Hinweise:</h3>
			<ul class="text-gray-700 space-y-2 list-disc list-inside">
				<li>
					Die Kennung des Fahrzeugs bzw. der Person kann in einigen Fällen wegfallen, wenn eine
					Einheit selbst gerufen wird.
				</li>
				<li>
					In Großstädten mit mehreren Ortsverbänden werden vor der taktischen Einheit bis zu zwei
					Ziffern hinzugefügt.
				</li>
				<li>THW-Führungsstellen müssen nicht nach den betreibenden OVs benannt werden.</li>
				<li>LuK-Stäbe sind in der Regel unter der Kennziffernfolge 86/00 erreichbar.</li>
			</ul>
			<div class="mt-4 text-sm text-gray-500">
				<p>
					Quelle: <a
						href="https://thwiki.org/t=Funkrufname"
						target="_blank"
						rel="noopener noreferrer"
						class="text-thw-600 hover:text-thw-700 underline">THWiki - Funkrufname</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
