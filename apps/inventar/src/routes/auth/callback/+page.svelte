<script lang="ts">
	import { dev } from '$app/environment';
	import {
		getUser,
		handleRedirectToApp,
		isAuthenticated,
		login,
		redirectToLastPathBeforeAuth
	} from '$lib/api/authApi';
	import { Button } from '@thw-tools/svelte-components';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	onMount(async () => {
		console.log('Callback page mounted');

		try {
			await handleRedirectToApp();
		} catch (error) {
			console.error('ERROR handleRedirect', error);
		}
	});

	const checkLoginStatus = async () => {
		if (!(await isAuthenticated())) {
			console.log('User is not authenticated');
			alert('User is not authenticated');
			login($page.url);
			return;
		}

		console.log('User is authenticated');
		alert('User is authenticated');
		redirectToLastPathBeforeAuth();
	};
</script>

<div class="flex flex-col gap-4 align-center items-center p-4">
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-bold">Login</h1>

		<div>Der Login wird durchgeführt...</div>
	</div>
	{#if dev}
		<div class="flex flex-col gap-2">
			<div class="text-center text-lg">Dev Mode</div>
			<div>
				<Button secondary click={checkLoginStatus}>Überprüfe Login Status</Button>
				<Button secondary click={() => getUser().then((user) => console.log(user))}>Get User</Button
				>
				<Button secondary click={() => login($page.url)}>Login</Button>
			</div>
		</div>
	{/if}
</div>
