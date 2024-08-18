<script lang="ts">
	import { handleRedirectToApp } from '$lib/api/authApi';
	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('Callback page mounted');

		try {
			await handleRedirectToApp();
		} catch (error) {
			console.error('ERROR handleRedirect', error);
		}
	});
</script>

<div class="flex flex-col gap-2 align-center items-center p-4">
	<h1 class="text-2xl font-bold">Login</h1>

	<div>Der Login wird durchgeführt...</div>
</div>
