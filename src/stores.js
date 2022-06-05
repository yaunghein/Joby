import { readable, writable } from 'svelte/store';
import { browser } from '$app/env';

export const joby_token = readable(null, (set) => {
	if (browser) {
		set(localStorage.getItem('joby_token'));
	}
});

export const path_to_navigate = writable(null);

export const current_user = writable(null);
