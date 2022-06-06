<script context="module">
	import { locale, loadTranslations } from '$lib/translations';

	export const load = async ({ url }) => {
		const { pathname } = url;

		const defaultLocale = 'en'; // get from cookie, user session, ...

		const initLocale = locale.get() || defaultLocale; // set default if no locale already set

		await loadTranslations(initLocale, pathname); // keep this just before the `return`

		return {};
	};
</script>

<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { scale, fade } from 'svelte/transition';

	// i18n
	import { t } from '$lib/translations';

	// components
	import Navbar from '$components/Navbar.svelte';

	// constants
	import ROUTES from '$constants/routes';

	// utils
	import { checkTokenLifetime } from '$utils/auth-utils';

	// states
	let open = false;
	let unsupportedLanguage;

	onMount(() => {
		const joby_token = localStorage.getItem('joby_token');
		const isTokenExpired = checkTokenLifetime(joby_token);
		if (!isTokenExpired) {
			goto(ROUTES.DASHBOARD);
		}

		const language = localStorage.getItem('joby_language');
		if (language) {
			locale.set(language);
		}
	});
</script>

<Navbar
	on:unsupport-language={(e) => {
		unsupportedLanguage = e.detail.language;
		open = true;
	}}
/>
<main class="bg-white my-10 md:my-16">
	<slot />
</main>
{#if open}
	<div
		class="fixed inset-0 z-50 bg-gray-900 bg-opacity-20 grid place-items-center p-4"
		transition:fade={{ duration: 150 }}
		on:click={() => (open = false)}
	>
		<div
			class="bg-white rounded-2xl p-6 w-full sm:w-96 border border-gray-200"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
		>
			<span class="select-none"
				>{$t('common.unsupportedLanguageDescription', { language: unsupportedLanguage })}</span
			>

			<div class="mt-6 pt-6 flex justify-end gap-4 border-t border-gray-100">
				<button
					class="bg-sky-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-custom-shodow-1 transition-all duration-150 ease-out hover:bg-sky-400"
					on:click={() => (open = false)}>{$t('common.unsupportedLanguageButtonLabel')}</button
				>
			</div>
		</div>
	</div>
{/if}
