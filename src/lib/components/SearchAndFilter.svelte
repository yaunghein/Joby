<script>
	import { scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// external packages
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';

	// svgs
	import SearchIcon from '$svgs/SearchIcon.svelte';
	import ChevronDown from '$svgs/ChevronDown.svelte';

	const FILTERS = [
		'pending',
		'interviewed',
		'got offer',
		'got rejected',
		'i rejected',
		'current',
		'goodbye'
	];

	let filters = [];
	let searchWord = '';
	$: dispatch('searchAndFilter', { filters, searchWord });
</script>

<div class="ml-0 w-full md:w-96 md:ml-auto relative mt-4 md:mt-0">
	<span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
		<SearchIcon />
	</span>
	<div class="w-full flex bg-white border border-gray-200 rounded-lg">
		<input
			placeholder="Search Your Jobs"
			class="w-[100%] text-gray-900 text-sm  py-2 pl-8 pr-2 outline-none rounded-l-lg"
			bind:value={searchWord}
		/>
		<Popover class="relative">
			<PopoverButton
				class="h-full bg-white flex items-center border-l border-gray-200 rounded-r-lg px-4"
			>
				<span class="text-gray-500 text-sm font-medium mr-2">Filters</span>
				<ChevronDown />
			</PopoverButton>
			<PopoverPanel>
				<div
					class="absolute z-10 w-72 bg-white shadow-custom-shodow-2 border border-gray-100 rounded-lg mt-2 p-6 right-0 flex flex-col items-end"
					transition:scale={{ duration: 100, start: 0.9 }}
				>
					<div class="w-full grid gap-2 grid-cols-2">
						{#each FILTERS as filter}
							<div class="flex items-center cursor-pointer">
								<input
									type="checkbox"
									name="filters"
									id={filter}
									value={filter}
									bind:group={filters}
									class="rounded text-sky-600 focus:ring-0 cursor-pointer"
								/>
								<label
									for={filter}
									class="text-gray-500 text-sm ml-2 capitalize select-none cursor-pointer"
									>{filter}</label
								>
							</div>
						{/each}
					</div>
					<div class="w-full h-[1px] bg-gray-100 my-4" />
					<button class="text-sky-500 text-sm -mb-1 hover:underline" on:click={() => (filters = [])}
						>Clear All Filters</button
					>
				</div>
			</PopoverPanel>
		</Popover>
	</div>
</div>
