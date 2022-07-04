module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				'custom-shodow-1': '0px 4px 16px rgba(14, 165, 233, 0.12)',
				'custom-shodow-2': '0px 2px 12px rgba(1, 16, 22, 0.08)'
			},
			colors: {
				bluedark: '#133463',
				blueishgraydark: '#3c516f'
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
