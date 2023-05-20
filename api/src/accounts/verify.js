import crypto from 'crypto';

const rootDomain = process.env.ROOT_DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

export async function createVerifyEmailToken(email) {
	try {
		const authString = `${jwtSecret}:${email}`;
		return crypto.createHash('sha256').update(authString).digest('hex');
	} catch (e) {
		console.error(e);
	}
}

export async function createVerifyEmailLink(email) {
	try {
		const emailToken = await createVerifyEmailToken(email);
		const uriEncodedEmail = encodeURIComponent(email);
		return `https://${rootDomain}/verify/${uriEncodedEmail}/${emailToken}`;
	} catch (e) {
		console.error(e);
	}
}
