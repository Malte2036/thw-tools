<script lang="ts">
	import {
		getUser,
		handleRedirectToApp,
		isAuthenticated,
		login,
		redirectToLastPathBeforeAuth
	} from '$lib/api/authApi';
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

	const checkLoginStatus = async () => {
		if (!(await isAuthenticated())) {
			console.log('User is not authenticated');
			alert('User is not authenticated');
			login();
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
	<div>
		<Button secondary click={checkLoginStatus}>Überprüfe Login Status</Button>
		<Button secondary click={() => getUser().then((user) => console.log(user))}>Get User</Button>
		<Button secondary click={login}>Login</Button>
	</div>
</div>
