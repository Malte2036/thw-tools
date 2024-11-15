import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// const isCapacitor = process.env.BUILD_TARGET === 'capacitor';
const isCapacitor = true;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: isCapacitor
			? adapterStatic({
					pages: 'build',
					assets: 'build',
					fallback: '200.html',
					precompress: false,
					strict: true
				})
			: adapterNode(),
		paths: {
			relative: false
		}
	}
};

export default config;
