<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import axios from 'axios';
	import { format } from 'date-fns';

	// store
	import { joby_token } from '$stores';

	// components
	import ContentShell from '$components/ContentShell.svelte';
	import JobCard from '$components/JobCard.svelte';
	import SearchAndFilter from '$components/SearchAndFilter.svelte';
	import Loading from '$components/Loading.svelte';
	import Error from '$components/Error.svelte';
	import Popup from '$components/Popup.svelte';

	// svgs
	import SadIcon from '$svgs/SadIcon.svelte';

	// config
	import { API_URL } from '$config/app-config';

	// constants
	import ROUTES from '$constants/routes';

	// states
	let jobs = [];
	let totalJobs = 0;
	let loading = true;
	let error;
	let showPopup = false;
	let selectedJobID;
	let yesLabel = 'Yes, sure!';
	let deleting = false;
	let isJobDeleteSuccess;

	// todo - check token and if it expires, show a session expire popup with only OK button and navigate to login page
	const fetchJobs = async () => {
		try {
			const response = await axios.get(`${API_URL}/jobs`, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			jobs = response.data.jobs;
			totalJobs = response.data.count;
			loading = false;
		} catch (err) {
			// console.log(err.response.status); // if status is 401, show session expire popup
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

	$: getJobCount = (status) => jobs?.filter((job) => job.status === status).length;

	$: STATUS = [
		{ label: 'pending', color: 'text-sky-500', 'job-count': getJobCount('pending') },
		{ label: 'interviewed', color: 'text-amber-500', 'job-count': getJobCount('interviewed') },
		{ label: 'got offer', color: 'text-emerald-500', 'job-count': getJobCount('got offer') },
		{ label: 'got rejected', color: 'text-red-600', 'job-count': getJobCount('got rejected') },
		{ label: 'i rejected', color: 'text-indigo-600', 'job-count': getJobCount('i rejected') },
		{ label: 'current', color: 'text-emerald-500', 'job-count': getJobCount('current') },
		{ label: 'goodbye', color: 'text-gray-500', 'job-count': getJobCount('goodbye') }
	];

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

	$: filteredJobs = [...jobs];
	const searchAndFilterJobs = (e) => {
		let { filters, searchWord } = e.detail;
		filteredJobs = [...jobs].filter(
			(job) =>
				job.company.toLowerCase().includes(searchWord.toLowerCase()) ||
				job.position.toLowerCase().includes(searchWord.toLowerCase())
		);
		if (filters.length !== 0) {
			filteredJobs = filteredJobs.filter((job) => filters.includes(job.status));
		}
	};
</script>

<svelte:head>
	<title>Dashboard - Joby - The Job Tracking Web App</title>
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
		<h2 slot="header" class="text-gray-900 text-2xl font-medium">Summery</h2>
		<div slot="body" class="flex flex-wrap gap-y-6">
			{#each STATUS as item}
				<div class="w-1/2 sm:w-1/3 lg:w-1/5 2xl:w-[14%] flex items-center flex-wrap">
					<h3 class="w-full {item.color} text-base font-medium uppercase">{item.label}</h3>
					<span class="text-gray-900 text-2xl font-semibold mr-2">{item['job-count']}</span>
					<span class="text-gray-500 text-sm">{item['job-count'] > 1 ? 'jobs' : 'job'}</span>
				</div>
			{/each}
		</div>
	</ContentShell>

	<ContentShell>
		<svelte:fragment slot="header">
			<h2 class="text-gray-900 text-2xl font-medium">Applied Jobs ({totalJobs})</h2>
			<SearchAndFilter on:searchAndFilter={searchAndFilterJobs} />
		</svelte:fragment>

		<svelte:fragment slot="noti">
			{#if isJobDeleteSuccess}
				<p
					class="bg-emerald-50 border-y border-emerald-300 text-emerald-500 text-sm px-6 py-4"
					in:fade={{ duration: 100 }}
				>
					Job deleted successfully.
				</p>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="body">
			{#if filteredJobs.length !== 0}
				<div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
					{#each filteredJobs as job (job._id)}
						<JobCard
							{job}
							on:delete={(e) => {
								selectedJobID = e.detail.jobID;
								showPopup = true;
							}}
						>
							<p slot="time" class="text-gray-500 text-xs leading-relaxed">
								Created at {format(new Date(job.createdAt), 'dd/MM/yyyy')}
							</p>
						</JobCard>
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
