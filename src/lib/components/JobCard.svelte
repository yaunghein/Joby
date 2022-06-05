<script>
	import { scale, fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	const dispatch = createEventDispatcher();

	// stores
	import { path_to_navigate } from '$stores';

	// external packages
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';

	// svgs
	import ThreeDots from '$svgs/ThreeDots.svelte';
	import EditIcon from '$svgs/EditIcon.svelte';
	import DeleteIcon from '$svgs/DeleteIcon.svelte';

	// constants
	import ROUTES from '$constants/routes';

	// components
	import Status from '$components/Status.svelte';

	// props
	export let job;
</script>

<div
	class="w-full bg-gray-50 border border-gray-200 rounded-2xl flex flex-grow flex-col"
	in:fade={{ duration: 200 }}
>
	<div class="p-6">
		<h3 class="text-gray-900 text-base font-semibold leading-normal mb-4">
			<span class="capitalize">{job.position}</span> at
			<span class="capitalize">{job.company}</span>
		</h3>
		<Status status={job.status} />
	</div>

	<div class="flex items-center px-6 py-3 mt-auto border-t-[1px] border-gray-200">
		<slot name="time" />
		<!-- <p class="text-gray-500 text-xs leading-relaxed">Created at 12/03/2022</p> -->
		<Menu class="relative ml-auto">
			<MenuButton class="w-4 flex items-center justify-center"><ThreeDots /></MenuButton>
			<MenuItems>
				<div
					class="absolute right-0 bottom-6 bg-white flex flex-col items-end p-4 rounded-lg shadow-custom-shodow-2"
					transition:scale={{ duration: 50, start: 0.9 }}
				>
					<MenuItem>
						<a
							sveltekit:prefetch
							href="{ROUTES.EDIT}/{job._id}"
							class="flex items-center mb-4"
							on:click={() => path_to_navigate.set($page.url.pathname)}
						>
							<span class="text-gray-500 text-sm mr-1">Edit</span>
							<EditIcon />
						</a>
					</MenuItem>
					<MenuItem>
						<button
							class="flex items-center"
							on:click={() => dispatch('delete', { jobID: job._id })}
							><span class="text-red-600 text-sm mr-1">Delete</span>
							<DeleteIcon />
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</Menu>
	</div>
</div>
