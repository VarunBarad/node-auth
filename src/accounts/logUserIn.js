import { createSession } from './session.js';
import { createTokens } from './tokens.js';

export async function logUserIn(userId, request, reply) {
	const connectionInformation = {
		ip: request.ip,
		userAgent: request.headers['user-agent'],
	};
	// create session
	const sessionToken = await createSession(userId, connectionInformation);
	console.log('sessionToken', sessionToken);
	// create JWT
	const { accessToken, refreshToken } = await createTokens(sessionToken, userId);
	// set cookie
	const now = new Date();
	const refreshExpires = now.setDate(now.getDate() + 30);
	reply
		.setCookie('accessToken', accessToken, {
			path: '/',
			httpOnly: true,
			domain: 'localhost',
		})
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			domain: 'localhost',
			expires: refreshExpires,
		});
}
