<script>
	import '../app.css';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ROUTES from '$constants/routes';
	import AppShell from '$components/AppShell.svelte';
	import { checkTokenLifetime } from '$utils/auth-utils';

	onMount(() => {
		const joby_token = localStorage.getItem('joby_token');
		const isTokenExpired = checkTokenLifetime(joby_token);
		if (isTokenExpired) {
			goto(ROUTES.LOGIN);
		}
	});
</script>

<AppShell>
	<slot />
</AppShell>
