<script>
	// props
	export let status;

	const COLORS = {
		pending: 'bg-sky-500 text-white',
		interviewed: 'bg-amber-500 text-white',
		'got offer': 'bg-emerald-500 text-white',
		'got rejected': 'bg-red-600 text-white',
		'i rejected': 'bg-indigo-600 text-white',
		current: 'bg-emerald-500 text-white',
		goodbye: 'bg-gray-200 text-gray-500'
	};
</script>

<span class="{COLORS[status]} text-xs font-normal leading-normal capitalize px-2 py-1 rounded-full">
	{status}
</span>
