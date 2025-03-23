import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@web-components': resolve('../../packages/web-components'),
			'@thw-tools/shared': resolve('../../packages/shared')
		}
	}
};

export default config;
