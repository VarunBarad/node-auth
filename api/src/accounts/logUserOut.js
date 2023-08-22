import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
const rootDomain = process.env.ROOT_DOMAIN;

export async function logUserOut(request, reply) {
	try {
		const { session } = await import('../session/session.js');

		if (request?.cookies?.refreshToken) {
			// get refresh token
			const refreshToken = request.cookies.refreshToken;
			// decode refresh token
			const decodedRefreshToken = jwt.verify(refreshToken, jwtSecret);
			// delete database record for session
			await session.deleteOne({
				sessionToken: decodedRefreshToken.sessionToken,
			});
		}
		// remove cookies
		reply.clearCookie('refreshToken', {
			path: '/',
			httpOnly: true,
			secure: true,
			domain: rootDomain,
		}).clearCookie('accessToken', {
			path: '/',
			httpOnly: true,
			secure: true,
			domain: rootDomain,
		});
	} catch (e) {
		console.error(e);
	}
}
