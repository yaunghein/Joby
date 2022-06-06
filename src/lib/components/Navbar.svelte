<script>
	import { scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	const dispatch = createEventDispatcher();

	// external packages
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';

	// svgs
	import Logo from '$svgs/Logo.svelte';
	import ChevronDown from '$svgs/ChevronDown.svelte';
	import MenuIcon from '$svgs/MenuIcon.svelte';
	import CloseIcon from '$svgs/CloseIcon.svelte';

	// constants
	import ROUTES from '$constants/routes';

	// i18n
	import { t, locale } from '$lib/translations';

	const LANGUAGES = [
		{ key: 'en', flag: 'https://flagcdn.com/gb.svg' },
		{ key: 'my', flag: 'https://flagcdn.com/mm.svg' },
		{ key: 'vn', flag: 'https://flagcdn.com/vn.svg' },
		{ key: 'jp', flag: 'https://flagcdn.com/jp.svg' }
	];

	$: currentLanguage = LANGUAGES.find((language) => language.key === $locale);
	$: languagesToShowInDropdown = LANGUAGES.filter((language) => language.key !== $locale);

	const switchLanguage = (key) => {
		if (key !== 'en' && key !== 'my') {
			return dispatch('unsupport-language', { language: $t(`common.${key}`) });
		}
		localStorage.setItem('joby_language', key);
		locale.set(key);
	};
</script>

<header class="bg-white h-[75px] sm:h-[90px] 2xl:h-24 shadow-sm">
	<div class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-between">
		<a sveltekit:prefetch href={ROUTES.LANDING}>
			<Logo />
		</a>
		<nav class="flex items-center">
			<Menu class="relative">
				<MenuButton class="hidden md:flex items-center">
					<span
						class="text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100"
						>{$t('common.sourceCodeLabel')}</span
					>
					<div class="-mb-[0.125rem] ml-2 shrink-0">
						<ChevronDown />
					</div>
				</MenuButton>
				<MenuItems>
					<div
						class="absolute z-10 w-28 bg-white shadow-custom-shodow-2 border border-gray-100 rounded-lg mt-2 py-2 right-0 overflow-hidden"
						transition:scale={{ duration: 100, start: 0.9 }}
					>
						<MenuItem let:active>
							<a
								href="https://github.com/yaunghein/Joby/"
								target="_blank"
								class={`w-28 text-gray-500 px-4 py-2 ${
									active && 'bg-gray-100'
								} capitalize flex justify-center`}
							>
								Frontend
							</a>
						</MenuItem>
						<MenuItem let:active>
							<a
								href="https://github.com/yaunghein/Joby-API"
								target="_blank"
								class={`w-28 text-gray-500 px-4 py-2 ${
									active && 'bg-gray-100'
								} capitalize flex justify-center`}
							>
								Backend
							</a>
						</MenuItem>
					</div>
				</MenuItems>
			</Menu>
			<a
				sveltekit:prefetch
				href={ROUTES.REGISTER}
				class="{$page.url.pathname === ROUTES.REGISTER
					? 'text-sky-500'
					: 'text-gray-500'} text-base hover:text-sky-500 font-normal ml-12 hidden md:block transition-all duration-100"
				>{$t('common.registerLabel')}</a
			>
			<a
				sveltekit:prefetch
				href={ROUTES.LOGIN}
				class="{$page.url.pathname === ROUTES.LOGIN
					? 'text-sky-500'
					: 'text-gray-500'} hover:text-sky-500 text-base font-normal ml-12 hidden md:block transition-all duration-100"
				>{$t('common.loginLabel')}</a
			>
			<Menu class="relative">
				<MenuButton
					class="ml-0 md:ml-12 text-gray-400 border border-gray-200 rounded-lg p-2 flex items-center hover:ring-2 hover:ring-gray-200"
				>
					<img src={currentLanguage.flag} alt="UK Flag" class="w-8 rounded-sm mr-2" />
					<ChevronDown />
				</MenuButton>
				<MenuItems>
					<div
						class="absolute bg-white shadow-sm border border-gray-100 rounded-lg mt-2 py-2 right-0 overflow-hidden"
						transition:scale={{ duration: 100, start: 0.9 }}
					>
						{#each languagesToShowInDropdown as language}
							<MenuItem let:active>
								<button on:click={() => switchLanguage(language.key)}>
									<div
										class={`text-gray-500 flex items-center px-4 py-2 w-[120%] ${
											active && 'bg-gray-100'
										}`}
									>
										<div class="w-8 mr-2">
											<img
												src={language.flag}
												alt="Myanmar Flag"
												class="rounded-sm mr-2 border border-gray-200"
											/>
										</div>
										<span class="capitalize">{$t(`common.${language.key}`)}</span>
									</div>
								</button>
							</MenuItem>
						{/each}
					</div>
				</MenuItems>
			</Menu>

			<!-- Mobile Menu  -->
			<div class="md:hidden ml-4 w-9 h-9 flex items-center justify-center">
				<Menu class="relative h-full" let:open>
					<MenuButton>
						<div class="relative text-gray-500">
							{#if open}
								<div class="w-9 h-9">
									<CloseIcon />
								</div>
							{:else}
								<div class="w-9 h-9">
									<MenuIcon />
								</div>
							{/if}
						</div>
					</MenuButton>
					<MenuItems>
						<div
							class="absolute flex flex-col items-end w-44 bg-white shadow-sm border border-gray-100 rounded-lg mt-2 p-2 right-0 overflow-hidden"
							transition:scale={{ duration: 100, start: 0.9 }}
						>
							<MenuItem>
								<a
									sveltekit:prefetch
									href={ROUTES.LOGIN}
									class="block text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100 p-2"
									>{$t('common.loginLabel')}</a
								>
							</MenuItem>
							<MenuItem>
								<a
									sveltekit:prefetch
									href={ROUTES.REGISTER}
									class="block text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100 p-2"
									>{$t('common.registerLabel')}</a
								>
							</MenuItem>
							<div class="w-full h-[1px] bg-gray-100 my-2" />
							<MenuItem>
								<span
									class="block text-base font-semibold text-gray-500 transition-all duration-100 p-2 -mt-1"
									>{$t('common.sourceCodeLabel')}</span
								>
							</MenuItem>
							<MenuItem>
								<a
									href="https://github.com/yaunghein/Joby"
									target="_blank"
									class={`block text-sky-400 px-2 my-2 capitalize`}
								>
									Frontend
								</a>
							</MenuItem>
							<MenuItem>
								<a
									href="https://github.com/yaunghein/Joby-API"
									target="_blank"
									class={`block text-sky-400 px-2 mb-2 capitalize`}
								>
									Backend
								</a>
							</MenuItem>
						</div>
					</MenuItems>
				</Menu>
			</div>
		</nav>
	</div>
</header>
