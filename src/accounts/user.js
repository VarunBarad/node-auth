import jwt from 'jsonwebtoken';
import mongo from 'mongodb';

const { ObjectId } = mongo;

const jwtSecret = process.env.JWT_SECRET;

export async function getUserFromCookies(request) {
	try {
		const { user } = await import('../user/user.js');

		// check to make sure access token exists
		if (request?.cookies?.accessToken) {
			// if access token
			const accessToken = request.cookies.accessToken;
			// decode access token
			const decodedAccessToken = jwt.verify(accessToken, jwtSecret);
			// return user from record
			return user.findOne({
				_id: new ObjectId(decodedAccessToken?.userId),
			});
		}
		// decode refresh token
		// look up session
		// confirm session is valid
		// if session is valid
		// look up current user
		// refresh tokens
		// return current user
	} catch (e) {
		console.error(e);
	}
}

export async function refreshTokens() {
	try {
	} catch (e) {
		console.error(e);
	}
}
