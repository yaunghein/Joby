<script>
	import { beforeUpdate, onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { clickOutside } from '$utils/clickOutside';
	import { format } from 'date-fns';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let initial;

	// svgs
	import CalendarIcon from '$svgs/CalendarIcon.svelte';

	const YEARS = [...Array(new Date().getFullYear()).keys()]
		.map((i) => i + 1)
		.reverse()
		.slice(0, 100);
	const MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	let today = new Date();
	let selectedDate = initial ? new Date(initial) : null;

	let month = today.getMonth();
	const setMonth = (param) => {
		month = param;
	};

	let year = today.getFullYear();
	const setYear = (param) => {
		year = param;
	};

	$: numDays = [];
	const setNumDays = (param) => {
		numDays = param;
	};

	let blankdays = [];
	const setBlankDays = (param) => {
		blankdays = param;
	};

	let showDatepicker = false;
	const setShowDatepicker = (param) => {
		showDatepicker = param;
	};

	const getNoOfDaysInTheActualMonth = () => {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const dayOfWeek = new Date(year, month).getDay();

		const blankdaysArray = [];
		for (let i = 1; i <= dayOfWeek; i += 1) {
			blankdaysArray.push(i);
		}

		const daysArray = [];
		for (let i = 1; i <= daysInMonth; i += 1) {
			daysArray.push(i);
		}
		setBlankDays(blankdaysArray);
		setNumDays(daysArray);
	};

	const isToday = (day) => {
		const clickedDate = new Date(year, month, day);
		return today.toDateString() === clickedDate.toDateString();
	};

	const setSelectedDate = (day) => {
		const clickedDate = new Date(year, month, day);
		selectedDate = clickedDate;
		setShowDatepicker(false);
	};

	onMount(() => {
		getNoOfDaysInTheActualMonth();
	});

	beforeUpdate(() => {
		getNoOfDaysInTheActualMonth();
	});

	const gotoPrevMonth = () => {
		if (month === 0) {
			setMonth(11);
			year -= 1;
			return;
		}
		setMonth(month - 1);
	};

	const gotoNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			year += 1;
			return;
		}
		setMonth(month + 1);
	};

	let isMonthDropdownOpen = false;
	let isYearDropdownOpen = false;
</script>

<div class="antialiased">
	<div class="container">
		<div class="w-full" use:clickOutside={{ callback: () => setShowDatepicker(false) }}>
			<div class="relative mb-3">
				<input type="hidden" name="date" />
				<div
					on:click={() => setShowDatepicker(!showDatepicker)}
					class="relative w-full bg-gray-50 text-gray-900 border {showDatepicker
						? 'border-sky-500'
						: 'border-gray-200'} rounded-lg p-3 pr-16 cursor-pointer"
				>
					<p class="text-gray-900 select-none">
						{selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Please select a date.'}
					</p>
					<div
						class="absolute right-0 top-0 h-full px-4 flex items-center justify-center border-l border-gray-200 pointer-events-none"
					>
						<CalendarIcon />
					</div>
				</div>
				{#if showDatepicker === true}
					<div
						class="w-72 bg-white mt-10 rounded-lg px-4 pb-4 pt-2 absolute z-10 top-4 left-1/2 transform -translate-x-1/2 border border-gray-200"
						transition:scale={{ duration: 150, start: 0.95 }}
					>
						<div class="flex justify-between items-center mb-6">
							<div>
								<button
									type="button"
									class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-sky-100 p-1 rounded-full"
									on:click={gotoPrevMonth}
								>
									<svg
										class="h-4 w-4 text-gray-500 inline-flex"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
							</div>
							<div class="flex item-center gap-1">
								<div class="relative">
									<button
										class="text-md font-bold text-gray-800 font-skylight"
										on:click|preventDefault={() => (isMonthDropdownOpen = !isMonthDropdownOpen)}
										>{MONTHS[month]}</button
									>
									{#if isMonthDropdownOpen}
										<div
											in:scale={{ duration: 150, start: 0.95 }}
											class="absolute w-3 h-3 bg-white transform rotate-45 left-1/2 -translate-x-1/2 top-[1.6rem] shadow"
										/>
										<div
											use:clickOutside={{ callback: () => (isMonthDropdownOpen = false) }}
											in:scale={{ duration: 150, start: 0.95 }}
											class="flex flex-col items-start gap-3 absolute left-1/2 transform -translate-x-1/2 top-8 px-4 py-2 shadow h-56 rounded-lg overflow-auto hide-scrollbar bg-white text-sm"
										>
											{#each MONTHS as month, index}
												<button
													on:click|preventDefault={() => {
														isMonthDropdownOpen = false;
														setMonth(index);
													}}
													class="hover:text-sky-500">{month}</button
												>
											{/each}
										</div>
									{/if}
								</div>
								<div class="relative">
									<button
										class="text-md font-bold text-gray-800 font-skylight"
										on:click|preventDefault={() => (isYearDropdownOpen = !isYearDropdownOpen)}
										>{year}</button
									>
									{#if isYearDropdownOpen}
										<div
											in:scale={{ duration: 150, start: 0.95 }}
											class="absolute w-3 h-3 bg-white transform rotate-45 left-1/2 -translate-x-1/2 top-[1.6rem] shadow"
										/>
										<div
											use:clickOutside={{ callback: () => (isYearDropdownOpen = false) }}
											in:scale={{ duration: 150, start: 0.95 }}
											class="flex flex-col items-start gap-3 absolute left-1/2 transform -translate-x-1/2 top-8 px-4 py-2 shadow h-56 rounded-lg overflow-auto hide-scrollbar bg-white text-sm"
										>
											{#each YEARS as year, index}
												<button
													on:click|preventDefault={() => {
														isYearDropdownOpen = false;
														setYear(year);
													}}
													class="hover:text-sky-500">{year}</button
												>
											{/each}
										</div>
									{/if}
								</div>
								<!-- <span class="text-md font-bold text-gray-800 font-skylight ml-1">{year}</span> -->
							</div>
							<div>
								<button
									type="button"
									class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-sky-100 p-1 rounded-full"
									on:click={gotoNextMonth}
								>
									<svg
										class="h-4 w-4 text-gray-500 inline-flex"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>
						<div class="flex flex-wrap -mx-1">
							{#each DAYS as day, index}
								<div class="px-1 mb-1" key={index}>
									<div
										key={index}
										class="text-blueishgray font-medium text-center text-xs w-7 font-skylight"
									>
										{day}
									</div>
								</div>
							{/each}
						</div>
						<div class="flex flex-wrap -mx-1">
							{#each blankdays as day, index}
								<div class="p-1" key={index}>
									<div
										key={day}
										class="cursor-pointer text-center text-sm rounded-lg leading-loose font-skylight w-7 text-gray-700"
									/>
								</div>
							{/each}
							{#each numDays as day, index}
								<div
									class="p-1 {selectedDate?.toDateString() ===
									new Date(year, month, day).toDateString()
										? 'bg-sky-500 text-white shadow-custom-shodow-2 rounded'
										: 'text-gray-900'}"
									key={index}
								>
									<div
										key={day}
										on:click={() => {
											setNumDays(numDays);
											setSelectedDate(day);
											dispatch('chooseDate', { date: selectedDate });
										}}
										class="cursor-pointer text-center text-sm leading-loose w-7 font-skylight"
									>
										{day}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
