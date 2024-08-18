<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
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

<div class="flex flex-col gap-2">
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
			alert(JSON.stringify(user, null, 2));
		}}>Get User</Button
	>

	<Button
		click={async () => {
			const token = await getToken();
			console.log(token);
			alert(JSON.stringify(token, null, 2));
		}}>Get Kinde Client</Button
	>

	<LinkButton url="/inventar">Inventar</LinkButton>
</div>
