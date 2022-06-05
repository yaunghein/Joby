<script>
	import { scale, fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// props
	export let yesLabel = 'Yes';
	export let noLabel = 'No';
</script>

<div
	class="fixed inset-0 z-50 bg-gray-900 bg-opacity-20 grid place-items-center p-4"
	transition:fade={{ duration: 150 }}
	on:click={() => dispatch('cancel')}
>
	<div
		class="bg-white rounded-2xl p-6 w-full sm:w-96 border border-gray-200"
		transition:scale={{ duration: 150, start: 0.95 }}
		on:click|stopPropagation
	>
		<span class="select-none">Are you sure you want to delete this job?</span>

		<div class="mt-6 pt-6 flex justify-end gap-4 border-t border-gray-100">
			<button
				class="text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 ease-out hover:bg-red-600 hover:text-white"
				on:click={() => dispatch('yes')}>{yesLabel}</button
			>
			<button
				class="bg-sky-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-custom-shodow-1 transition-all duration-150 ease-out hover:bg-sky-400"
				on:click={() => dispatch('cancel')}>{noLabel}</button
			>
		</div>
	</div>
</div>
