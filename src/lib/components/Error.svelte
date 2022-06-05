<script>
	import { fade } from 'svelte/transition';

	export let error;
</script>

<p
	class="bg-red-100 border border-red-300 text-red-600 text-sm p-[0.9rem] mt-4 rounded-lg"
	in:fade={{ duration: 100 }}
>
	{@html error}
</p>
