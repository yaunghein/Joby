import { browser } from '$app/env';

export const checkTokenLifetime = (token) => {
	if (browser) {
		if (!token) {
			return true;
		}
		const payload = JSON.parse(atob(token.split('.')[1]));
		const exp = payload.exp * 1000;
		const now = new Date().getTime();
		return exp < now ? true : false;
	}
};
