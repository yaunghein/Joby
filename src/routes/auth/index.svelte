<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// constants
	import ROUTES from '$constants/routes';

	onMount(() => {
		const joby_token = localStorage.getItem('joby_token');
		if (joby_token) {
			goto(ROUTES.DASHBOARD);
		} else {
			goto(ROUTES.LOGIN);
		}
	});
</script>
