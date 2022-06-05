import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/lib/components'),
					$svgs: path.resolve('./src/lib/svgs'),
					$constants: path.resolve('./src/constants'),
					$config: path.resolve('./src/config'),
					$utils: path.resolve('./src/utils'),
					$stores: path.resolve('./src/stores')
				}
			}
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
