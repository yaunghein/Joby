<script>
	import { onMount } from 'svelte';
	import { scale, fade } from 'svelte/transition';

	// third party packages
	import axios from 'axios';
	import { format } from 'date-fns';

	// store
	import { joby_token } from '$stores';

	// svgs
	import SadIcon from '$svgs/SadIcon.svelte';

	// constants
	import ROUTES from '$constants/routes';

	// components
	import ContentShell from '$components/ContentShell.svelte';
	import JobCard from '$components/JobCard.svelte';
	import Popup from '$components/Popup.svelte';
	import Loading from '$components/Loading.svelte';
	import Error from '$components/Error.svelte';

	// config
	import { API_URL } from '$config/app-config';

	// utils
	import { getDistance } from '$utils';

	// states
	let jobs = [];
	let loading = true;
	let error;
	let showPopup = false;
	let selectedJobID;
	let yesLabel = 'Yes, sure!';
	let deleting = false;
	let isJobDeleteSuccess;

	$: jobsToShow = jobs
		.filter((job) => job.status === 'current' || job.status === 'goodbye')
		.sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));

	// todo- refector the onMount fetching login to the layout component
	const fetchJobs = async () => {
		try {
			const response = await axios.get(`${API_URL}/jobs`, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			jobs = response.data.jobs;
			loading = false;
		} catch (err) {
			error = err.response.data.msg;
			loading = false;
		}

		// clear job delete success noti
		if (isJobDeleteSuccess) {
			setTimeout(() => {
				isJobDeleteSuccess = false;
			}, 5000);
		}
	};

	onMount(() => {
		fetchJobs();
	});

	const deleteJob = async () => {
		deleting = true;
		yesLabel = 'Deleting...';
		try {
			await axios.delete(`${API_URL}/jobs/${selectedJobID}`, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			deleting = false;
			yesLabel = 'Yes, sure!';
			isJobDeleteSuccess = true;
			fetchJobs();
			showPopup = false;
		} catch (err) {
			// console.log(err.response.status); // if status is 401, show session expire popup
			error = err.response.data.msg;
		}
	};

	/***
		- If (index + 1) is odd number => hide the line from left side, and add the class 'justify-self-end -mr-1', and add the class 'mb-32' if the (index + 1) is not equal to the length of job array
		- If (index + 1) is even number => hide the line from right side, and add the class 'justify-self-start -mb-32 -ml-1'
		- If (index + 1) is greater than 2, and (index + 1) is odd number, add the class '-mt-12'
		- If (index + 1) is greater than 2, and (index + 1) is even number, add the class '-mt-10'
	***/
	const getClassesByIndex = (index, length) => {
		let classes = [];
		index++; // add one to the index to prevent not to type (index + 1) again and again
		if (index % 2 !== 0) classes.push('justify-self-end -mr-1');
		if (index % 2 === 0) classes.push('justify-self-start -mb-24 -ml-1');
		if (index % 2 !== 0 && index !== length) classes.push('mb-32');
		if (index % 2 !== 0 && index > 2) classes.push('-mt-12');
		if (index % 2 === 0 && index > 2) classes.push('-mt-10');
		return classes.join(' ');
	};
</script>

<svelte:head>
	<title>Career Timeline - Joby - The Job Tracking Web App</title>
</svelte:head>

{#if showPopup}
	<div class="fixed z-10 {deleting && 'pointer-events-none'}">
		<Popup
			on:yes={deleteJob}
			on:cancel={() => (showPopup = false)}
			{yesLabel}
			noLabel="No, I'm not."
		/>
	</div>
{/if}

{#if loading}
	<Loading {loading} />
{:else if error}
	<Error {error} />
{:else}
	<ContentShell>
		<h2 slot="header" class="text-gray-900 text-2xl font-medium">Career Timeline</h2>

		<svelte:fragment slot="noti">
			{#if isJobDeleteSuccess}
				<p
					class="bg-emerald-50 border-y border-emerald-300 text-emerald-500 text-sm px-6 py-4"
					in:fade={{ duration: 100 }}
				>
					Job deleted successfully.
				</p>
			{:else if error}
				<p
					class="bg-red-100 border-y border-red-300 text-red-600 text-sm px-6 py-4"
					in:fade={{ duration: 100 }}
				>
					{error}
				</p>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="body">
			{#if jobsToShow.length > 0}
				<div class="hidden sm:block md:hidden lg:block">
					<div class="relative w-full grid grid-cols-2">
						{#each jobsToShow as job, index (job._id)}
							<div
								class="relative w-[300px] flex items-center {getClassesByIndex(
									index,
									jobsToShow.length
								)}"
								in:scale={{ duration: 400, start: 0.95, delay: index * 100 }}
							>
								<!-- Left Line -->
								<div class="shrink-0 flex items-center {(index + 1) % 2 !== 0 && 'hidden'}">
									<div class="shrink-0 bg-gray-200 w-2 h-2 rounded-[1px]" />
									<div class="bg-gray-200 w-10 h-[1px]" />
								</div>
								<JobCard
									{job}
									on:delete={(e) => {
										selectedJobID = e.detail.jobID;
										showPopup = true;
									}}
								>
									<svelte:fragment slot="time">
										{#if job.status === 'goodbye'}
											<div class="text-gray-500 text-xs flex items-center gap-2">
												<p class="leading-relaxed">
													{format(new Date(job.startDate), 'MMM yyyy')} to {format(
														new Date(job.endDate),
														'MMM yyyy'
													)}
												</p>
												<span> • </span>
												<p class="leading-relaxed">
													{getDistance(job.startDate, job.endDate)}
												</p>
											</div>
										{/if}
										{#if job.status === 'current'}
											<div class="text-gray-500 text-xs flex items-center gap-2">
												<p class="leading-relaxed">
													{format(new Date(job.startDate), 'MMM yyyy')} to Present
												</p>
												<span> • </span>
												<p class="leading-relaxed">
													{getDistance(job.startDate)}
												</p>
											</div>
										{/if}
									</svelte:fragment>
								</JobCard>

								<!-- Right Line -->
								<div class="shrink-0 flex items-center {(index + 1) % 2 === 0 && 'hidden'}">
									<div class="bg-gray-200 w-10 h-[1px]" />
									<div class="shrink-0 bg-gray-200 w-2 h-2 rounded-[1px]" />
								</div>
							</div>
						{/each}

						<!-- Middle Divider -->
						<div
							class="bg-gray-200 w-[1px] absolute -top-6 -bottom-6 left-1/2 transform -translate-x-1/2 "
						/>
					</div>
				</div>

				<!-- The Timeline again for responsiveness -->
				<!-- The timeline layout for large screen is complex enough. For simplicity, I just use seperate markup. -->
				<div class="sm:hidden md:block lg:hidden py-2 -mt-6">
					{#each jobsToShow as job, index (job._id)}
						<div
							class="relative w-full sm:w-[300px] md:w-full lg:w-[300px] flex flex-col items-center"
							in:scale={{ duration: 400, start: 0.95, delay: index * 100 }}
						>
							<!-- Top Line -->
							<div class="shrink-0 flex flex-col items-center">
								<div class="bg-gray-200 w-[1px] {index > 0 ? 'h-5' : 'h-10'}" />
								<div class="shrink-0 bg-gray-200 w-2 h-2 rounded-[1px]" />
							</div>
							<JobCard
								{job}
								on:delete={(e) => {
									selectedJobID = e.detail.jobID;
									showPopup = true;
								}}
							>
								<svelte:fragment slot="time">
									{#if job.status === 'goodbye'}
										<div class="text-gray-500 text-xs flex items-center gap-2">
											<p class="leading-relaxed">
												{format(new Date(job.startDate), 'MMM yyyy')} to {format(
													new Date(job.endDate),
													'MMM yyyy'
												)}
											</p>
											<span> • </span>
											<p class="leading-relaxed">
												{getDistance(job.startDate, job.endDate)}
											</p>
										</div>
									{/if}
									{#if job.status === 'current'}
										<div class="text-gray-500 text-xs flex items-center gap-2">
											<p class="leading-relaxed">
												{format(new Date(job.startDate), 'MMM yyyy')} to Present
											</p>
											<span> • </span>
											<p class="leading-relaxed">
												{getDistance(job.startDate)}
											</p>
										</div>
									{/if}
								</svelte:fragment>
							</JobCard>

							<!-- Bottom Line -->
							<div
								class="shrink-0 flex flex-col items-center 
								{index + 1 === jobsToShow.length && 'hidden'}"
							>
								<div class="shrink-0 bg-gray-200 w-2 h-2 rounded-[1px]" />
								<div class="bg-gray-200 w-[1px] h-5" />
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="grid place-items-center py-10 text-gray-500">
					<SadIcon />
					<h3 class="font-medium mt-2">No job to show at the moment.</h3>
					<a
						sveltekit:prefetch
						href={ROUTES.ADD_NEW}
						class="bg-sky-500 text-white text-sm font-semibold px-4 py-2 mt-4 rounded-lg shadow-custom-shodow-1 transition-all duration-150 ease-out hover:bg-sky-400"
						>Add Job</a
					>
				</div>
			{/if}
		</svelte:fragment>
	</ContentShell>
{/if}
