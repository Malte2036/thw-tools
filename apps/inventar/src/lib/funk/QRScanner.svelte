<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
	import { onDestroy, onMount } from 'svelte';
	import PermissionDeniedDialog from './PermissionDeniedDialog.svelte';

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
	let permissionDenied = $state(false);
	let cameras = $state<{ id: string; label: string }[]>([]);
	let selectedCamera = $state('');

	let html5Qrcode: Html5Qrcode;

	onMount(async () => {
		init();
		await loadCameras();
	});

	onDestroy(() => {
		if (scanning) {
			stop();
		}
	});

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	async function loadCameras() {
		try {
			const devices = await Html5Qrcode.getCameras();
			cameras = devices.map((device) => ({
				id: device.id,
				label: device.label
			}));
			if (cameras.length > 0) {
				selectedCamera = cameras[0].id;
			}
		} catch (err) {
			console.error('Error loading cameras:', err);
		}
	}

	interface ExtendedHtml5QrcodeCameraScanConfig extends Html5QrcodeCameraScanConfig {
		focusMode?: string;
		advanced?: { zoom: number }[];
		experimentalFeatures?: { useBarCodeDetectorIfSupported: boolean };
	}

	async function start() {
		try {
			const config: ExtendedHtml5QrcodeCameraScanConfig = {
				fps: 10,
				qrbox: qrboxFunction,
				aspectRatio: 1.777778, // 16:9
				focusMode: 'continuous',
				advanced: [{ zoom: 2.0 }],
				experimentalFeatures: {
					useBarCodeDetectorIfSupported: true
				}
			};

			scanning = true;
			await html5Qrcode.start({ deviceId: selectedCamera }, config, onScanSuccess, onScanFailure);
		} catch (error) {
			scanning = false;

			if (typeof error === 'string' && error.includes('NotAllowedError')) {
				permissionDenied = true;
			} else {
				console.error(error);
			}
		}
	}

	async function stop() {
		try {
			await html5Qrcode.stop();
		} catch (error) {
			console.error(error);
		} finally {
			scanning = false;
		}
	}

	async function switchCamera(newCameraId: string) {
		if (scanning) {
			await stop();
			selectedCamera = newCameraId;
			await start();
		} else {
			selectedCamera = newCameraId;
		}
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
		let qrboxSize = Math.max(100, Math.floor(minEdgeSize * minEdgePercentage));

		return {
			width: qrboxSize,
			height: qrboxSize
		};
	};
</script>

<div class="flex flex-col gap-4">
	{#if cameras.length > 1}
		<select
			class="p-2 border rounded"
			value={selectedCamera}
			onchange={(e) => switchCamera(e.currentTarget.value)}
		>
			{#each cameras as camera}
				<option value={camera.id}>{camera.label}</option>
			{/each}
		</select>
	{/if}

	<reader id="reader" class={`bg-gray-500 h-full w-full ${scanning ? '' : 'hidden'}`}></reader>
	{#if scanning}
		<Button secondary click={stop}>{closeButtonText}</Button>
	{:else}
		<Button click={start}>{scanButtonText}</Button>
	{/if}
</div>

{#if permissionDenied}
	<PermissionDeniedDialog onClose={() => (permissionDenied = false)} />
{/if}
