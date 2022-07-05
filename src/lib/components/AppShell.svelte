<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import axios from 'axios';

	// stores
	import { joby_token, current_user } from '$stores';

	// config
	import { API_URL } from '$config/app-config';

	// external packages
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';

	// svgs
	import BgBlueLogo from '$svgs/BgBlueLogo.svelte';
	import AvatarPlaceholder from '$svgs/AvatarPlaceholder.svelte';
	import MenuIcon from '$svgs/MenuIcon.svelte';
	import CloseIcon from '$svgs/CloseIcon.svelte';
	import Logo from '$svgs/Logo.svelte';

	// constant
	import ROUTES from '$constants/routes';

	// components
	import AvatarUpload from '$components/AvatarUpload.svelte';

	// states
	let open = false;

	$: currentPage = $page.url.pathname;

	onMount(async () => {
		try {
			const response = await axios.get(`${API_URL}/users`, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			current_user.set(response.data.user);
		} catch (err) {
			if (err.response.status === 404) {
				localStorage.removeItem('joby_token');
				goto(ROUTES.LOGIN);
			}
		}
	});

	const logout = async () => {
		localStorage.removeItem('joby_token');
		goto(ROUTES.LOGIN);
	};

	const updateAvatar = async (e) => {
		try {
			await axios.patch(
				`${API_URL}/users`,
				{ avatar: e.detail.url },
				{ headers: { authorization: `Bearer ${$joby_token}` } }
			);
			open = false;
			current_user.update((user) => ({ ...user, avatar: e.detail.url }));
		} catch (err) {
			console.log(err);
			open = false;
		}
	};
</script>

{#if open}
	<AvatarUpload on:cancel={() => (open = false)} on:success={updateAvatar} />
{/if}
<div class="max-full mx-auto h-screen flex">
	<!-- Side Bar -->
	<aside class="w-[20rem] h-full bg-gray-50 hidden md:flex flex-col shrink-0">
		<div class="h-[5.625rem] bg-sky-500 flex items-center px-10 rounded-bl-2xl">
			<div class="flex items-end">
				<div class="w-20 h-10">
					<BgBlueLogo />
				</div>
				<span class="text-white text-sm ml-3">Job Tracking App</span>
			</div>
		</div>

		<nav class="px-10 pt-6">
			<a sveltekit:prefetch href={ROUTES.DASHBOARD} class="flex items-center py-5">
				<div
					class={`bg-sky-500 ${
						currentPage === ROUTES.DASHBOARD ? 'w-6' : 'w-2'
					} h-2 rounded-full transition-all ease-out`}
				/>
				<span
					class={`${
						currentPage === ROUTES.DASHBOARD ? 'text-sky-500' : 'text-grey-500'
					} text-base font-semibold ml-[10px] transition-all ease-out`}>All Jobs</span
				>
			</a>
			<a sveltekit:prefetch href={ROUTES.ADD_NEW} class="flex items-center py-5">
				<div
					class={`bg-sky-500 ${
						currentPage === ROUTES.ADD_NEW ? 'w-6' : 'w-2'
					} h-2 rounded-full transition-all ease-out`}
				/>
				<span
					class={`${
						currentPage === ROUTES.ADD_NEW ? 'text-sky-500' : 'text-grey-500'
					} text-base font-semibold ml-[10px] transition-all ease-out`}>Add New Job</span
				>
			</a>
			<a sveltekit:prefetch href={ROUTES.TIMELINE} class="flex items-center py-5">
				<div
					class={`bg-sky-500 ${
						currentPage === ROUTES.TIMELINE ? 'w-6' : 'w-2'
					} h-2 rounded-full transition-all ease-out`}
				/>
				<span
					class={`${
						currentPage === ROUTES.TIMELINE ? 'text-sky-500' : 'text-grey-500'
					} text-base font-semibold ml-[10px] transition-all ease-out`}>Career Timeline</span
				>
			</a>
		</nav>

		<p class="text-gray-500 text-sm font-semibold mt-auto px-10 mb-10">
			Code with 💙 by <a href={ROUTES.ME} target="_blank" class="text-sky-500">Yan Aung Hein</a>
		</p>
	</aside>

	<div class="w-full">
		<!-- Nav -->
		<div
			class="h-[4.6875rem] sm:h-[5.625rem] bg-white flex items-center justify-between md:justify-end px-4 sm:px-6 shadow-sm border-b border-gray-200"
		>
			<a sveltekit:prefetch href={ROUTES.DASHBOARD} class="w-20 h-10 md:hidden">
				<Logo />
			</a>

			<div class="flex items-center">
				<!-- Mobile Menu  -->
				<div class="md:hidden mr-4 w-12 h-12 flex items-center justify-center">
					<Menu class="relative h-full" let:open>
						<MenuButton>
							<div class="relative text-gray-500">
								{#if open}
									<div class="w-12 h-12">
										<CloseIcon />
									</div>
								{:else}
									<div class="w-12 h-12">
										<MenuIcon />
									</div>
								{/if}
							</div>
						</MenuButton>
						<MenuItems>
							<div
								class="absolute z-10 flex flex-col items-end w-40 bg-white shadow-custom-shodow-2 border border-gray-100 rounded-lg mt-2 p-2 right-0 overflow-hidden"
								transition:scale={{ duration: 100, start: 0.9 }}
							>
								<MenuItem>
									<a
										sveltekit:prefetch
										href={ROUTES.DASHBOARD}
										class="block text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100 p-2"
										>Dashboard</a
									>
								</MenuItem>
								<MenuItem>
									<a
										sveltekit:prefetch
										href={ROUTES.ADD_NEW}
										class="block text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100 p-2 my-1"
										>Add New Job</a
									>
								</MenuItem>
								<MenuItem>
									<a
										sveltekit:prefetch
										href={ROUTES.TIMELINE}
										class="block text-gray-500 text-base hover:text-sky-500 font-normal transition-all duration-100 p-2 -mt-1"
										>Career Timeline</a
									>
								</MenuItem>
								<div class="w-full h-[1px] bg-gray-100 my-2" />
								<MenuItem>
									<span
										class="block text-base font-semibold text-gray-500 transition-all duration-100 p-2 -mt-1"
										>Source Code</span
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

				<!-- Profile -->
				<Menu class="relative">
					{#if $current_user}
						<MenuButton>
							<div class="flex items-center pb-1">
								<span class="text-gray-500 font-semibold mr-2 hidden md:block"
									>{$current_user.name}</span
								>
								{#if $current_user.avatar}
									<img
										src={$current_user.avatar}
										alt="{$current_user.name} Avatar"
										class="w-12 h-12 rounded-full object-cover border-2 border-sky-500"
									/>
								{:else}
									<div class="w-12 h-12">
										<AvatarPlaceholder />
									</div>
								{/if}
							</div>
						</MenuButton>
					{/if}
					<MenuItems>
						<div
							class="absolute z-10 bg-white shadow-custom-shodow-2 border border-gray-100 rounded-lg mt-2 p-4 right-0 flex flex-col items-end"
							transition:scale={{ duration: 100, start: 0.9 }}
						>
							<MenuItem>
								<span class="text-gray-500 whitespace-nowrap">{$current_user.email}</span>
							</MenuItem>
							<div class="w-full h-[1px] bg-gray-100 my-4" />
							<MenuItem>
								<button
									class="text-sky-500 font-normal mb-3 hover:underline"
									on:click={() => (open = true)}>Change Avater</button
								>
							</MenuItem>
							<MenuItem>
								<button class="text-sky-500 font-normal mb-1 hover:underline" on:click={logout}
									>Log out</button
								>
							</MenuItem>
						</div>
					</MenuItems>
				</Menu>
			</div>
		</div>

		<!-- Content -->
		<main class="slot-wrapper overflow-scroll" style="height: calc(100vh - 90px);">
			<div class="p-4 sm:p-6 grid gap-10">
				<slot />
			</div>
		</main>
	</div>
</div>

<style>
	.slot-wrapper::-webkit-scrollbar {
		display: none;
	}
	.slot-wrapper {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
