/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'../../packages/svelte-components/src/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				thw: {
					DEFAULT: '#120A8F',
					50: '#f1f3fd',
					100: '#e2e7fa',
					200: '#c6d0f5',
					300: '#9eabed',
					400: '#7180e3',
					500: '#4f5bd8',
					600: '#353fc4',
					700: '#262eaa',
					800: '#1a2094',
					900: '#120a8f',
					950: '#0e086d'
				},
				accent: '#EEE648',
				correct: {
					DEFAULT: '#24CEA6',
					200: '#24cea640',
					600: '#0e9f7c',
					700: '#0a6f58'
				},
				wrong: {
					DEFAULT: '#DE5444',
					200: '#de544440',
					600: '#b03a2f',
					700: '#8a2a20'
				},
				gray: {
					DEFAULT: '#D9D9D9',
					50: '#f7f7f7',
					100: '#ededed',
					200: '#d9d9d9',
					300: '#c8c8c8',
					400: '#adadad',
					500: '#999999',
					600: '#888888',
					700: '#7b7b7b',
					800: '#676767',
					900: '#545454',
					950: '#363636'
				}
			},
			boxShadow: {
				card: '0 1px 2px 0 rgb(18 10 143 / 0.05), 0 4px 12px 0 rgb(18 10 143 / 0.06)'
			},
			fontFamily: {
				calibri: ['Calibri', 'sans-serif']
			}
		}
	},
	plugins: []
};
