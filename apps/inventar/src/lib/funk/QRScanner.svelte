<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		onScan: (decodedText: string) => void;
		scanButtonText?: string;
		closeButtonText?: string;
	}

	let {
		onScan,
		scanButtonText = 'Gerät scannen',
		closeButtonText = 'Scanner schließen'
	}: Props = $props();

	let scanning = $state(false);

	let html5Qrcode: Html5Qrcode;

	onMount(init);

	onDestroy(() => {
		if (scanning) {
			stop();
		}
	});

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	interface ExtendedHtml5QrcodeCameraScanConfig extends Html5QrcodeCameraScanConfig {
		focusMode?: string;
		advanced?: { zoom: number }[];
		experimentalFeatures?: { useBarCodeDetectorIfSupported: boolean };
	}

	function start() {
		const config: ExtendedHtml5QrcodeCameraScanConfig = {
			fps: 10,
			qrbox: qrboxFunction,
			aspectRatio: 1,
			focusMode: 'continuous',
			advanced: [{ zoom: 2.0 }],
			experimentalFeatures: {
				useBarCodeDetectorIfSupported: true
			}
		};

		html5Qrcode.start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
	}

	function onScanSuccess(decodedText: string, decodedResult: any) {
		onScan(decodedText);
	}

	function onScanFailure(error: any) {
		// console.warn(`Code scan error = ${error}`);
	}

	let qrboxFunction = function (viewfinderWidth: number, viewfinderHeight: number) {
		let minEdgePercentage = 0.7; // 70%
		let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
		let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
		return {
			width: qrboxSize,
			height: qrboxSize
		};
	};
</script>

<div class="flex flex-col gap-4">
	<reader id="reader" class={`bg-gray-500 h-full w-full ${scanning ? '' : 'hidden'}`}></reader>
	{#if scanning}
		<Button secondary click={stop}>{closeButtonText}</Button>
	{:else}
		<Button click={start}>{scanButtonText}</Button>
	{/if}
</div>

<style>
</style>
