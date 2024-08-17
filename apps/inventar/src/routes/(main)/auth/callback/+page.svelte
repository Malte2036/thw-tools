<script lang="ts">
	import { getKindeClient, getUser, handleRedirectToApp, getToken, login } from '$lib/api/authApi';
	import Button from '$lib/Button.svelte';
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

<h1>Callback</h1>

<Button
	click={() => {
		console.log('login');

		login();
	}}>Login</Button
>

<Button
	click={async () => {
		const user = await getUser();
		console.log(user);
	}}>Get User</Button
>

<Button
	click={async () => {
		const token = await getToken();
		console.log(token);
	}}>Get Kinde Client</Button
>
