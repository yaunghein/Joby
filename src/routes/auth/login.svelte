<script>
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { fade } from 'svelte/transition';

	// i18n
	import { t } from '$lib/translations';

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

	// states
	let email;
	let password;
	let passwordType = 'password';
	let error;
	let success;
	let isLoggingIn = false;
	let isSending = false;

	$: disabled = email === '' || email === undefined || password === '' || password === undefined;

	const switchPasswordType = () => {
		passwordType === 'password' ? (passwordType = 'text') : (passwordType = 'password');
	};

	const login = async () => {
		success = '';
		error = '';
		isLoggingIn = true;
		try {
			const response = await axios.post(`${API_URL}/auth/login`, { email, password });
			localStorage.setItem('joby_token', response.data.token);
			await goto(ROUTES.DASHBOARD);
		} catch (err) {
			if (err.response.data.msg) {
				error = err.response.data.msg;
			} else {
				error = 'There is an error. Please try again later. 😥';
			}
		}
		isLoggingIn = false;
	};

	const sendVerificationLinkAgain = async () => {
		try {
			isSending = true;
			const response = await axios.post(`${API_URL}/auth/send-verification-email-again`, { email });
			isSending = false;
			error = '';
			success = response.data.msg;
		} catch (err) {
			isSending = false;
			if (err.response.data.msg) {
				error = err.response.data.msg;
			} else {
				error = 'There is an error. Please try again later. 😥';
			}
		}
	};
</script>

<svelte:head>
	<title>{$t('login.pageTitle')}</title>
</svelte:head>

<div
	class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-center"
	in:fade={{ duration: 200 }}
>
	<form
		class="w-[32.5rem] mx-auto border-2 border-gray-200 rounded-2xl px-5 sm:px-10 py-8 sm:py-10"
		on:submit|preventDefault={login}
	>
		<h1 class="text-sky-500 text-[2rem] font-bold mb-6">{$t('login.heading')}</h1>
		<div class="grid gap-4 mb-10">
			<!-- Email Field  -->
			<div class="flex flex-col">
				<label for="email" class="text-gray-500 text-sm mb-2">{$t('login.emailLabel')}</label>
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

			<!-- Password Field  -->
			<div class="flex flex-col">
				<label for="password" class="text-gray-500 text-sm mb-2">{$t('login.passwordLabel')}</label>
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
				<span class="text-red-600 text-sm transform -translate-y-2">Please provide a password.</span
				>
			{/if}
		</div>

		<!-- Submit Button -->
		<button
			class="w-full bg-sky-500 text-white text-base font-semibold text-center p-[13px] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-100 ease-out"
			{disabled}>{isLoggingIn ? $t('login.buttonLabelLoggingIn') : $t('login.buttonLabel')}</button
		>

		<a href={ROUTES.FORGOT_PASSWORD} class="block text-sky-500 hover:underline text-base mt-4">
			Forgot password?
		</a>

		<p class="text-gray-500 text-base mt-4">
			{@html $t('login.question', { link: ROUTES.REGISTER })}
		</p>

		{#if error && error !== 'Please verify your email.'}
			<Error {error} />
		{/if}

		{#if error && error === 'Please verify your email.'}
			<p
				class="bg-amber-50 border border-amber-300 text-amber-600 text-sm p-[0.9rem] mt-4 rounded-lg"
				in:fade={{ duration: 100 }}
			>
				{error}
				{#if isSending}
					<span class="font-semibold">Sending...</span>
				{:else}
					<button class="font-semibold underline" on:click={sendVerificationLinkAgain}>
						Send verification link again.
					</button>
				{/if}
			</p>
		{/if}

		{#if success}
			<Success {success} />
		{/if}
	</form>
</div>
