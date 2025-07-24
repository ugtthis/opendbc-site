/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['"JetBrains Mono"', 'monospace'],
			},
			screens: {
				'lg-2': '1160px',
			},
		},
	},
	plugins: [],
}
