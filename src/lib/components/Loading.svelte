<script>
	import { fade } from 'svelte/transition';

	// third party packages
	import { RingLoader } from 'svelte-loading-spinners';

	// props
	export let loading;

	// states
	let shouldStart = false;

	const timerID = setTimeout(() => (shouldStart = true), 500);
	loading === false && clearInterval(timerID);
</script>

{#if shouldStart}
	<div class="flex justify-center mt-4" in:fade={{ duration: 200 }}>
		<RingLoader size="4" color="#0EA5E9" unit="rem" duration="1.5s" />
	</div>
{/if}
