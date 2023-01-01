/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				thw: {
					DEFAULT: '#120a8f',
					50: '#f1f3ff',
					100: '#e6e9ff',
					200: '#d0d7ff',
					300: '#abb4ff',
					400: '#7b83ff',
					500: '#4647ff',
					600: '#2b20ff',
					700: '#1b0ef3',
					800: '#160bcc',
					900: '#120a8f'
				}
			}
		}
	},
	plugins: []
};
