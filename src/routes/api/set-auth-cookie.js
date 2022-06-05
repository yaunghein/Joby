import { serialize } from 'cookie';

export async function post({ request }) {
	const { token } = await request.json();
	return {
		status: 200,
		headers: {
			'set-cookie': serialize('joby_token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production'
			})
		}
	};
}
