<script>
	import { fade } from 'svelte/transition';

	// constants
	import ROUTES from '$constants/routes';

	// i18n
	import { t } from '$lib/translations';
</script>

<svelte:head>
	<title>{$t('landing.pageTitle')}</title>
</svelte:head>

<section in:fade={{ duration: 200 }}>
	<div class="max-w-7xl px-4 md:px-10 mx-auto h-full flex items-center justify-center">
		<div class="w-full grid items-center grid-cols-1 md:grid-cols-2">
			<div class="flex flex-col items-center md:block">
				<h1
					class="text-gray-900 text-5xl md:text-[4rem] text-center md:text-left font-bold leading-[1.2] capitalize"
				>
					{@html $t('landing.heroHeading')}
				</h1>
				<p
					class="text-gray-900 text-base text-center md:text-left mt-6 mb-10 leading-relaxed max-w-full md:max-w-[25rem]"
				>
					{$t('landing.heroDescription')}
				</p>
				<a
					sveltekit:prefetch
					href={ROUTES.REGISTER}
					class="bg-sky-500 text-white text-base font-semibold py-4 px-12 rounded-lg shadow-custom-shodow-1 transition-all duration-150 ease-out hover:bg-sky-400"
					>{$t('landing.heroCtaButtonLabel')}</a
				>
				<p class="text-gray-900 text-xs mt-4 md:mt-8">
					{@html $t('landing.owner', { link: ROUTES.ME })}
				</p>
			</div>

			<div class="mt-10 md:mt-0">
				<img src="/images/joby-hero-image.png" alt="Joby Dashboard Screenshot" />
			</div>
		</div>
	</div>
</section>
