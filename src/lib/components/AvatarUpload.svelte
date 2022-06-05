<script>
	import { scale, fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import axios from 'axios';

	const dispatch = createEventDispatcher();

	// stores
	import { joby_token, current_user } from '$stores';

	// svgs
	import AvatarPlaceholder from '$svgs/AvatarPlaceholder.svelte';
	import CameraIcon from '$svgs/CameraIcon.svelte';

	// config
	import { API_URL } from '$config/app-config';

	// states
	let avatar;
	let preview;
	let uploading = false;

	$: {
		if (avatar) {
			let reader = new FileReader();
			reader.readAsDataURL(avatar);
			reader.onload = (e) => {
				preview = e.target.result;
			};
		}
	}

	const uploadAvatar = async () => {
		uploading = true;
		const formData = new FormData();
		formData.append('image', avatar);
		try {
			const response = await axios.post(`${API_URL}/users/uploads`, formData, {
				headers: {
					authorization: `Bearer ${$joby_token}`
				}
			});
			uploading = false;
			dispatch('success', { url: response.data.url });
		} catch (err) {
			uploading = false;
			console.log(err);
		}
	};
</script>

<div
	class="fixed inset-0 z-50 bg-gray-900 bg-opacity-20 grid place-items-center p-4 {uploading &&
		'pointer-events-none'}"
	transition:fade={{ duration: 150 }}
	on:click={() => dispatch('cancel')}
>
	<div
		class="bg-white rounded-2xl p-6 w-full sm:w-96 border border-gray-200 flex flex-col items-center"
		transition:scale={{ duration: 150, start: 0.95 }}
		on:click|stopPropagation
	>
		<h4 class="text-sky-500 text-xl  font-bold select-none">Upload Avatar</h4>

		<form on:submit|preventDefault={uploadAvatar} class="flex flex-col items-center mt-6">
			<div class="relative w-36 h-36 rounded-full overflow-hidden border-[0.375rem] border-sky-500">
				{#if preview}
					<img alt="preview" src={preview} class="w-full h-full object-cover" />
				{:else if $current_user.avatar}
					<img
						alt="{$current_user.name} Avatar"
						src={$current_user.avatar}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div class="transform scale-110">
						<AvatarPlaceholder />
					</div>
				{/if}
				<label
					for="avatar"
					class="absolute z-10 bg-gray-900 bg-opacity-20 hover:bg-opacity-50 bottom-0 left-0 right-0 grid place-items-center p-2 transition-all duration-150"
				>
					<CameraIcon />
				</label>
				<input
					type="file"
					name="avatar"
					id="avatar"
					on:change={(e) => (avatar = e.target.files[0])}
					class="hidden"
					accept="image/*"
				/>
			</div>

			<button
				class="bg-sky-500 text-white text-sm font-semibold px-4 py-2 rounded-lg mt-6 {avatar &&
					'shadow-custom-shodow-1'} {uploading &&
					'pointer-events-none cursor-not-allowed'} transition-all duration-150 ease-out hover:bg-sky-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
				disabled={!avatar}>{uploading ? 'Uploading...' : 'Upload'}</button
			>
		</form>
		<button
			class="text-gray-500 text-sm font-base px-4 py-2 rounded-lg mt-2 hover:underline {uploading &&
				'pointer-events-none'}"
			on:click={() => dispatch('cancel')}>Cancle</button
		>
	</div>
</div>
