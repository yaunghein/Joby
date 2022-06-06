<script>
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// third party packages
	import axios from 'axios';
	import { format } from 'date-fns';

	// store
	import { joby_token, path_to_navigate } from '$stores';

	// config
	import { API_URL } from '$config/app-config';

	// components
	import ContentShell from '$components/ContentShell.svelte';
	import Error from '$components/Error.svelte';
	import Loading from '$components/Loading.svelte';

	// svgs
	import AddFormIllustration from '$svgs/AddFormIllustration.svelte';
	import ChevronDownIcon from '$svgs/ChevronDown.svelte';
	import CalendarIcon from '$svgs/CalendarIcon.svelte';

	// utils
	import { checkTokenLifetime } from '$utils/auth-utils';

	// constants
	import ROUTES from '$constants/routes';

	// states
	let loading = true;
	let company;
	let position;
	let status = 'pending';
	let startDate;
	let endDate;
	let isSendindData = false;
	let error;

	// button enable/disable checks - initial array is to reset the array on each status change
	$: initialConditionsToBeDisabled = [
		company === undefined,
		company === '',
		position === undefined,
		position === ''
	];
	$: conditionsToBeDisabled = initialConditionsToBeDisabled;
	$: disabled = conditionsToBeDisabled.some((condition) => condition === true);
	$: if (status === 'current') {
		conditionsToBeDisabled = initialConditionsToBeDisabled;
		conditionsToBeDisabled = [...conditionsToBeDisabled, startDate === undefined, startDate === ''];
	}
	$: if (status === 'goodbye') {
		conditionsToBeDisabled = initialConditionsToBeDisabled;
		conditionsToBeDisabled = [
			...conditionsToBeDisabled,
			startDate === undefined,
			startDate === null,
			startDate === '',
			endDate === undefined,
			endDate === null,
			endDate === ''
		];
	}

	// todo - check token and if it expires, show a session expire popup with only OK button and navigate to login page
	onMount(async () => {
		const isTokenExpired = checkTokenLifetime($joby_token);
		if (isTokenExpired) {
			goto(ROUTES.LOGIN); // change to showing up session expired popup
		}
		const response = await axios.get(`${API_URL}/jobs/${$page.params.jobID}`, {
			headers: {
				authorization: `Bearer ${$joby_token}`
			}
		});
		const { job } = response.data;
		company = job.company;
		position = job.position;
		status = job.status;
		startDate = job.startDate && format(new Date(job.startDate), 'yyyy-MM-dd');
		endDate = job.endDate && format(new Date(job.endDate), 'yyyy-MM-dd');
		loading = false;
	});

	const updateJob = async () => {
		// clear the dates if the status if not current and bye bye
		if (status !== 'goodbye') endDate = '';
		if (status !== 'current' && status !== 'goodbye') startDate = '';

		// clear error and success message
		error = '';

		const updatedJob = {
			company,
			position,
			status,
			startDate: startDate ? new Date(startDate).toISOString() : '',
			endDate: endDate ? new Date(endDate).toISOString() : ''
		};

		try {
			isSendindData = true;
			await axios.patch(`${API_URL}/jobs/${$page.params.jobID}`, updatedJob, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			isSendindData = false;
			goto($path_to_navigate);
		} catch (err) {
			error = err.response.data.msg;
			isSendindData = false;
		}
	};
</script>

<svelte:head>
	<title>Edit {position || ''} @ {company || ''} - Joby - The Job Tracking Web App</title>
</svelte:head>

{#if loading}
	<Loading {loading} />
{:else}
	<ContentShell>
		<h2 slot="header" class="text-gray-900 text-2xl font-medium">Edit Job</h2>
		<div slot="body" class="grid gap-16 grid-cols-1 lg:grid-cols-2">
			<!-- Add Form  -->
			<form class="mt-5" on:submit|preventDefault={updateJob}>
				<div class="grid gap-4 mb-10">
					<!-- Company Field  -->
					<div class="flex flex-col">
						<label for="company" class="text-gray-500 text-sm mb-2">Company</label>
						<input
							type="text"
							id="company"
							name="company"
							class="bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 focus:border-sky-500 focus:ring-sky-500"
							bind:value={company}
						/>
					</div>
					{#if company === ''}
						<span class="text-red-600 text-sm transform -translate-y-2"
							>Please provide a company name.</span
						>
					{/if}

					<!-- Position Field  -->
					<div class="flex flex-col">
						<label for="company" class="text-gray-500 text-sm mb-2">Position</label>
						<input
							type="text"
							id="position"
							name="position"
							class="bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 focus:border-sky-500 focus:ring-sky-500"
							bind:value={position}
						/>
					</div>
					{#if position === ''}
						<span class="text-red-600 text-sm transform -translate-y-2"
							>Please provide a position.</span
						>
					{/if}

					<!-- Status Field  -->
					<div class="flex flex-col">
						<label for="status" class="text-gray-500 text-sm mb-2">Status</label>
						<div class="relative">
							<select
								class="appearance-none w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 focus:border-sky-500 focus:ring-sky-500 cursor-pointer"
								bind:value={status}
							>
								<option value="pending">Pending</option>
								<option value="interviewed">Interviewed</option>
								<option value="got offer">Got Offer</option>
								<option value="got rejected">Got Rejected</option>
								<option value="i rejected">I Rejected</option>
								<option value="current">Current</option>
								<option value="goodbye">Goodbye</option>
							</select>
							<div
								class="absolute right-0 top-0 h-full px-4 flex items-center justify-center border-l border-gray-200 pointer-events-none"
							>
								<ChevronDownIcon />
							</div>
						</div>
					</div>

					<!-- Start Date Field  -->
					{#if status === 'current' || status === 'goodbye'}
						<div class="flex flex-col" in:fade={{ duration: 100 }}>
							<label for="start_date" class="text-gray-500 text-sm mb-2">Start Date</label>
							<div class="relative">
								<input
									type="date"
									name="start_date"
									id="start_date"
									class="appearance-none w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 pr-16 focus:border-sky-500 focus:ring-sky-500 cursor-pointer"
									bind:value={startDate}
								/>
								<div
									class="absolute right-0 top-0 h-full px-4 flex items-center justify-center border-l border-gray-200 pointer-events-none"
								>
									<CalendarIcon />
								</div>
							</div>
						</div>
					{/if}

					<!-- End Date Field  -->
					{#if status === 'goodbye'}
						<div class="flex flex-col" in:fade={{ duration: 100 }}>
							<label for="end_date" class="text-gray-500 text-sm mb-2">End Date</label>
							<div class="relative">
								<input
									type="date"
									name="end_date"
									id="end_date"
									class="appearance-none w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-3 pr-16 focus:border-sky-500 focus:ring-sky-500 cursor-pointer"
									bind:value={endDate}
								/>
								<div
									class="absolute right-0 top-0 h-full px-4 flex items-center justify-center border-l border-gray-200 pointer-events-none"
								>
									<CalendarIcon />
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					class="w-full {isSendindData
						? 'bg-sky-600 pointer-events-none'
						: 'bg-sky-500'} text-white text-base font-semibold text-center p-[13px] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-100 ease-out"
					{disabled}>{isSendindData ? 'Updating to database...' : 'Update'}</button
				>

				{#if error}
					<Error {error} />
				{/if}
			</form>

			<!-- Illustration  -->
			<div class="mt-12">
				<AddFormIllustration />
			</div>
		</div>
	</ContentShell>
{/if}
