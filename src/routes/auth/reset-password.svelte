<script>
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	// svgs
	import EyeOpenIcon from '$svgs/EyeOpenIcon.svelte';
	import EyeCloseIcon from '$svgs/EyeCloseIcon.svelte';

	// constants
	import ROUTES from '$constants/routes';

	// config
	import { API_URL } from '$config/app-config';

	// components
	import Error from '$components/Error.svelte';
	import Success from '$components/Success.svelte';
	import Loading from '$components/Loading.svelte';

	// states
	let password;
	let passwordType = 'password';
	let error;
	let success;
	let isSending = false;
	let isRedirecting = false;

	$: disabled = password === '' || password === undefined;

	const switchPasswordType = () => {
		passwordType === 'password' ? (passwordType = 'text') : (passwordType = 'password');
	};

	const resetPassword = async () => {
		success = '';
		error = '';
		isSending = true;
		const token = $page.url.searchParams.get('token');
		const email = $page.url.searchParams.get('email');
		try {
			await axios.post(`${API_URL}/auth/reset-password`, {
				token,
				email,
				newPassword: password
			});
			isRedirecting = true;
			setTimeout(() => {
				goto(ROUTES.LOGIN);
				isRedirecting = false;
			}, 3000);
		} catch (err) {
			isSending = false;
			error = err.response.data.msg;
		}
	};
</script>

<svelte:head>
	<title>Reset Password - Joby - The Job Tracking Web App</title>
</svelte:head>

<div
	class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-center"
	in:fade={{ duration: 200 }}
>
	{#if isRedirecting}
		<div class="w-[32.5rem] mx-auto px-5 sm:px-10 py-8 sm:py-10 flex flex-col items-center gap-8">
			<div class="w-16">
				<Loading loading={isRedirecting} />
			</div>
			<p class="text-sky-500 text-xl font-semibold mb-6">Redirecting you to the login page...</p>
		</div>
	{:else}
		<form
			class="w-[32.5rem] mx-auto border-2 border-gray-200 rounded-2xl px-5 sm:px-10 py-8 sm:py-10"
			on:submit|preventDefault={resetPassword}
		>
			<h1 class="text-sky-500 text-[2rem] font-bold mb-6">Reset Password</h1>
			<div class="grid gap-4 mb-10">
				<!-- Password Field  -->
				<div class="flex flex-col">
					<label for="password" class="text-gray-500 text-sm mb-2">New Password</label>
					<div class="relative">
						<input
							type={passwordType}
							id="password"
							name="password"
							class="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 pr-16 focus:border-sky-500 focus:ring-sky-500"
							on:input={(e) => (password = e.target.value)}
						/>
						<!-- have to use on:input={} instead of bind:value because type attribue can't be dynamic with two-way binding -->
						<button
							on:click|preventDefault={switchPasswordType}
							class="absolute right-0 top-0 h-full px-4 flex items-center justify-center border-l border-gray-200"
						>
							{#if passwordType === 'password'}
								<EyeOpenIcon />
							{:else}
								<EyeCloseIcon />
							{/if}
						</button>
					</div>
				</div>
				{#if password === ''}
					<span class="text-red-600 text-sm transform -translate-y-2"
						>Please provide a password.</span
					>
				{/if}
			</div>

			<!-- Submit Button -->
			<button
				class="w-full bg-sky-500 text-white text-base font-semibold text-center p-[13px] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-100 ease-out
      {isSending && 'pointer-events-none'}"
				{disabled}
			>
				{isSending ? 'Updating to database...' : 'Change New Password'}
			</button>

			{#if error}
				<Error {error} />
			{/if}

			{#if success}
				<Success {success} />
			{/if}
		</form>
	{/if}
</div>
