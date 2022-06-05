<script>
	import { fade } from 'svelte/transition';

	export let success;
</script>

<p
	class="bg-emerald-50 border border-emerald-300 text-emerald-500 text-sm p-[0.9rem] mt-4 rounded-lg"
	in:fade={{ duration: 100 }}
>
	{@html success}
</p>
