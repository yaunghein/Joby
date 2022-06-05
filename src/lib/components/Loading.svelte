<script>
	import { fade } from 'svelte/transition';

	// props
	export let loading;

	// states
	let shouldStart = false;

	const timerID = setTimeout(() => (shouldStart = true), 500);
	loading === false && clearInterval(timerID);
</script>

{#if shouldStart}
	<p in:fade={{ duration: 100 }}>Loading...</p>
{/if}
