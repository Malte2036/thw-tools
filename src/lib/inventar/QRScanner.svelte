<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';

	export let onScan: (decodedText: string) => void;

	let scanning = false;

	let html5Qrcode: Html5Qrcode;

	onMount(init);

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			onScanFailure
		);
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
</script>

<div class="flex flex-col gap-4">
	<reader id="reader" class={`bg-gray-500 h-full w-full ${scanning ? '' : 'hidden'}`}></reader>
	{#if scanning}
		<Button secondary click={stop}>Scanner schließen</Button>
	{:else}
		<Button click={start}>Gerät scannen</Button>
	{/if}
</div>

<style>
</style>
