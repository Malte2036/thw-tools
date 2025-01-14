/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				thw: {
					DEFAULT: '#120A8F',
					50: '#f8f7fe',
					100: '#eeedfe',
					200: '#dedcfd',
					300: '#c8c4fb',
					400: '#a49ef8',
					500: '#7f77f5',
					600: '#5e54f3',
					700: '#4c40f2',
					800: '#1f11ee',
					900: '#1a0ec7'
				},
				accent: '#EEE648',
				correct: {
					DEFAULT: '#24CEA6',
					200: '#24cea640'
				},
				wrong: {
					DEFAULT: '#DE5444',
					200: '#de544440'
				},
				gray: '#D9D9D9'
			},
			fontFamily: {
				calibri: ['Calibri', 'sans-serif']
			}
		}
	},
	plugins: []
};
