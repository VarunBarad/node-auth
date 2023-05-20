import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export async function createTokens(sessionToken, userId) {
	try {
		// create a refresh token: session id
		const refreshToken = jwt.sign({ sessionToken }, jwtSecret);
		// access token: session id, user id
		const accessToken = jwt.sign({ sessionToken, userId }, jwtSecret);
		// return refresh token and access token
		return { accessToken, refreshToken };
	} catch (e) {
		console.error('e', e);
	}
}
