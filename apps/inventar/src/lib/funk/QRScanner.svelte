<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
	import { onDestroy, onMount } from 'svelte';
	import PermissionDeniedDialog from './PermissionDeniedDialog.svelte';
	import { settings } from '$lib/shared/stores/settingsStore';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import FloatingActionButton from '$lib/FloatingActionButton.svelte';
	import QrCodeIcon from '$lib/icons/QRCodeIcon.svelte';

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

	let readerRef = $state<HTMLDivElement | null>(null);

	let scanning = $state(false);
	let selectCameraOpen = $state(false);
	let permissionDenied = $state(false);
	let cameras = $state<{ id: string; label: string }[]>([]);

	let html5Qrcode: Html5Qrcode;

	onMount(async () => {
		init();
	});

	onDestroy(() => {
		if (scanning) {
			stopScan();
		}
	});

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function scrollReaderIntoView() {
		if (readerRef) {
			readerRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function handlePermissionError(error: unknown) {
		if (
			(error instanceof Error && error.name === 'NotAllowedError') ||
			(typeof error === 'string' && error.includes('NotAllowedError'))
		) {
			permissionDenied = true;
			console.warn('Permission denied to access camera');
			return true;
		}
		console.error(error);
		return false;
	}

	async function loadCameras() {
		try {
			const devices = await Html5Qrcode.getCameras();
			if (devices.length === 0) {
				console.log('No cameras found');

				$bannerMessage = {
					message: 'Es konnte keine Kamera gefunden werden',
					type: 'error',
					autoDismiss: {
						duration: 5000
					}
				};
				selectCameraOpen = false;
				cameras = [];
				return;
			}

			cameras = devices.map((device) => ({
				id: device.id,
				label: device.label
			}));
		} catch (error) {
			selectCameraOpen = false;
			handlePermissionError(error);
		}
	}

	interface ExtendedHtml5QrcodeCameraScanConfig extends Html5QrcodeCameraScanConfig {
		focusMode?: string;
		advanced?: { zoom: number }[];
		experimentalFeatures?: { useBarCodeDetectorIfSupported: boolean };
	}

	function getDefaultCamera() {
		return (
			cameras.find((camera) => camera.label.toLowerCase().includes('ultra'))?.id ??
			cameras.find((camera) => camera.label.toLowerCase().includes('back'))?.id ??
			cameras.find((camera) => camera.label.toLowerCase().includes('rück'))?.id ??
			cameras[0].id
		);
	}

	async function start() {
		selectCameraOpen = true;
		await loadCameras();

		const isSelectedCameraValid = cameras.find((camera) => camera.id === $settings.selectedCamera);

		if (cameras.length > 0 && !isSelectedCameraValid) {
			$settings.selectedCamera = getDefaultCamera();
		}

		await startScan();
	}

	async function stop() {
		selectCameraOpen = false;
		await stopScan();
	}

	async function startScan() {
		if (!$settings.selectedCamera) {
			console.warn('Could not start scan, no camera selected');
			return;
		}

		try {
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

			scanning = true;
			await html5Qrcode.start(
				{ deviceId: $settings.selectedCamera },
				config,
				onScanSuccess,
				onScanFailure
			);

			scrollReaderIntoView();
		} catch (error) {
			scanning = false;
			handlePermissionError(error);
		}
	}

	async function stopScan() {
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
			await stopScan();
		}

		$settings.selectedCamera = newCameraId;
		await startScan();
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
	{#if selectCameraOpen}
		<div class="text-center text-gray-500">Bitte wähle eine Kamera aus dem Dropdown aus:</div>
		<select
			class="p-2 border rounded"
			value={$settings.selectedCamera}
			onchange={(e) => switchCamera(e.currentTarget.value)}
		>
			{#each cameras as camera}
				<option value={camera.id}>{camera.label}</option>
			{/each}
		</select>
	{/if}

	<reader
		id="reader"
		bind:this={readerRef}
		class={`bg-gray-500 h-full w-full ${scanning ? '' : 'hidden'}`}
	></reader>
	{#if scanning}
		<Button secondary click={stop}>{closeButtonText}</Button>
	{:else}
		<Button click={start}>{scanButtonText}</Button>

		<FloatingActionButton click={() => start()}>
			<QrCodeIcon />
		</FloatingActionButton>
	{/if}
</div>

{#if permissionDenied}
	<PermissionDeniedDialog onClose={() => (permissionDenied = false)} />
{/if}
