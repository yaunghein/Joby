import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'landing',
			routes: ['/'],
			loader: async () => (await import('./en/landing.json')).default
		},
		{
			locale: 'en',
			key: 'register',
			routes: ['/auth/register'],
			loader: async () => (await import('./en/register.json')).default
		},
		{
			locale: 'en',
			key: 'login',
			routes: ['/auth/login'],
			loader: async () => (await import('./en/login.json')).default
		},
		{
			locale: 'my',
			key: 'common',
			loader: async () => (await import('./my/common.json')).default
		},
		{
			locale: 'my',
			key: 'landing',
			routes: ['/'],
			loader: async () => (await import('./my/landing.json')).default
		},
		{
			locale: 'my',
			key: 'register',
			routes: ['/auth/register'],
			loader: async () => (await import('./my/register.json')).default
		},
		{
			locale: 'my',
			key: 'login',
			routes: ['/auth/login'],
			loader: async () => (await import('./my/login.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
