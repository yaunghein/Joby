<script>
	import axios from 'axios';
	import { fade } from 'svelte/transition';

	// constants
	import ROUTES from '$constants/routes';

	// config
	import { API_URL } from '$config/app-config';

	// components
	import Error from '$components/Error.svelte';
	import Success from '$components/Success.svelte';

	// states
	let email;
	let error;
	let success;
	let isSending = false;

	$: disabled = email === '' || email === undefined;

	const sendPasswordResetEmail = async () => {
		success = '';
		error = '';
		try {
			isSending = true;
			const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
			isSending = false;
			success = response.data.msg;
			email = undefined;
		} catch (err) {
			isSending = false;
			error = err.response.data.msg;
		}
	};
</script>

<svelte:head>
	<title>Forgot Password - Joby - The Job Tracking Web App</title>
</svelte:head>

<div
	class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-center"
	in:fade={{ duration: 200 }}
>
	<form
		class="w-[32.5rem] mx-auto border-2 border-gray-200 rounded-2xl px-5 sm:px-10 py-8 sm:py-10"
		on:submit|preventDefault={sendPasswordResetEmail}
	>
		<h1 class="text-sky-500 text-[2rem] font-bold mb-6">Forgot Password</h1>
		<div class="grid gap-4 mb-10">
			<!-- Email Field  -->
			<div class="flex flex-col">
				<label for="email" class="text-gray-500 text-sm mb-2">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 focus:border-sky-500 focus:ring-sky-500"
					bind:value={email}
				/>
			</div>
			{#if email === ''}
				<span class="text-red-600 text-sm transform -translate-y-2">Please provide an email.</span>
			{/if}
		</div>

		<!-- Submit Button -->
		<button
			class="w-full bg-sky-500 hover:bg-sky-400 text-white text-base font-semibold text-center p-[13px] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-100 ease-out 
      {isSending && 'pointer-events-none'}"
			{disabled}
		>
			{isSending ? 'Sending the link...' : 'Get Password Reset Link'}
		</button>

		{#if error}
			<Error {error} />
		{/if}

		{#if success}
			<Success {success} />
		{/if}
	</form>
</div>
