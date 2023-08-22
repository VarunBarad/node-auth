import jwt from 'jsonwebtoken';
import mongo from 'mongodb';
import { createTokens } from './tokens.js';
import bcrypt from 'bcryptjs';
const { genSalt, hash } = bcrypt;

const { ObjectId } = mongo;

const jwtSecret = process.env.JWT_SECRET;
const rootDomain = process.env.ROOT_DOMAIN;

export async function getUserFromCookies(request, reply) {
	try {
		const { user } = await import('../user/user.js');
		const { session } = await import('../session/session.js');

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
		} else if (request?.cookies?.refreshToken) {
			// decode refresh token
			const refreshToken = request.cookies.refreshToken;
			const decodedRefreshToken = jwt.verify(refreshToken, jwtSecret);
			// look up session
			const currentSession = await session.findOne({
				sessionToken: decodedRefreshToken?.sessionToken,
			});
			// confirm session is valid
			if (currentSession?.valid) {
				// look up current user
				const currentUser = await user.findOne({
					_id: new ObjectId(currentSession.userId),
				});
				// refresh tokens
				await refreshTokens(currentSession.sessionToken, currentUser._id, reply);
				// return current user
				return currentUser;
			}
		}
	} catch (e) {
		console.error(e);
	}
}

export async function refreshTokens(sessionToken, userId, reply) {
	try {
		const { accessToken, refreshToken } = await createTokens(sessionToken, userId);
		const now = new Date();
		const refreshExpires = now.setDate(now.getDate() + 30);

		reply
			.setCookie('accessToken', accessToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				domain: rootDomain,
			})
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				domain: rootDomain,
				expires: refreshExpires,
			});
	} catch (e) {
		console.error(e);
	}
}

export async function changePassword(userId, newPassword) {
	try {
		const { user } = await import('../user/user.js');

		const salt = await genSalt(10);
		const hashedPassword = await hash(newPassword, salt);

		return user.updateOne({
			_id: userId,
		}, {
			$set: {
				password: hashedPassword,
			},
		});
	} catch (e) {
		console.log(e);
	}
}
