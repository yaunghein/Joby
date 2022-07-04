<script>
	import { fade } from 'svelte/transition';
</script>

<div class="bg-white border border-gray-200 rounded-2xl" in:fade={{ duration: 100 }}>
	<div
		class="bg-gray-50 px-5 py-4 border-b border-gray-200 rounded-t-2xl flex items-start md:items-center flex-col md:flex-row"
	>
		<slot name="header" />
	</div>
	<slot name="noti" />
	<div class="p-4 sm:p-6">
		<slot name="body" />
	</div>
</div>
