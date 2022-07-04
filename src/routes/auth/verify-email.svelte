<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import axios from 'axios';

	// components
	import Loading from '$components/Loading.svelte';
	import Error from '$components/Error.svelte';

	// svgs
	import Check from '$svgs/Check.svelte';

	// config
	import { API_URL } from '$config/app-config';

	// constants
	import ROUTES from '$constants/routes';

	// states
	let loading = true;
	let error;

	const verifyEmail = async () => {
		const verificationToken = $page.url.searchParams.get('token');
		const email = $page.url.searchParams.get('email');
		try {
			await axios.post(`${API_URL}/auth/verify-email`, { verificationToken, email });
			loading = false;
		} catch (err) {
			if (err.response.data.msg === 'Already verified.') {
				goto(ROUTES.LOGIN);
				return;
			}
			loading = false;
			error = err.response.data.msg;
		}
	};

	onMount(() => setTimeout(() => verifyEmail(), 3000));
</script>

<div
	class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-center"
	in:fade={{ duration: 200 }}
>
	{#if loading}
		<div class="w-[32.5rem] mx-auto px-5 sm:px-10 py-8 sm:py-10 flex flex-col items-center gap-8">
			<div class="w-16">
				<Loading {loading} />
			</div>
			<p class="text-sky-500 text-xl font-semibold mb-6">Verifying your email...</p>
		</div>
	{:else if error}
		<Error {error} />
	{:else}
		<div
			class="w-[32.5rem] mx-auto border-2 border-gray-100 rounded-2xl px-5 sm:px-16 py-8 sm:py-10 flex flex-col items-center"
		>
			<div class="w-16">
				<Check />
			</div>
			<h1 class="text-gray-900 text-xl font-semibold my-3">Email Verified Successfully!</h1>
			<p class="text-center text-sm text-gray-700 mb-6">
				Thanks you so much for your time to verify the email. Now start tracking you applied jobs by
				logging into the app.
			</p>
			<button
				class="bg-sky-500 hover:bg-sky-400 text-white text-base font-semibold text-center px-6 py-2 rounded-lg transition-all duration-100 ease-out"
				on:click={() => goto(ROUTES.LOGIN)}
			>
				Login
			</button>
		</div>
	{/if}
</div>
