import crypto from "crypto";

const rootDomain = process.env.ROOT_DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

function createResetToken(email, expirationTimestamp) {
	try {
		const authString = `${jwtSecret}:${email}:${expirationTimestamp}`;
		return crypto.createHash("sha256").update(authString).digest("hex");
	} catch (e) {
		console.error(e);
	}
}

function validateExpirationTimestamp(expirationTimestamp) {
	// One day in milliseconds
	const expirationTime = 24 * 60 * 60 * 1000;
	// Difference between now and expired time
	const dateDiff = Number(expirationTimestamp) - Date.now();
	// We're expired if not in past OR difference in time is less than allowed
	const isValid = dateDiff > 0 && dateDiff < expirationTime;
	return isValid;
}

export async function createResetEmailLink(email) {
	try {
		// link email contains user email, token, expiration date
		const uriEncodedEmail = encodeURIComponent(email);
		// create timestamp
		const expirationTimestamp = Date.now() + (1000 * 60 * 60 * 24); // 24 hours
		// create token
		const token = createResetToken(email, expirationTimestamp);
		return `https://${rootDomain}/reset/${uriEncodedEmail}/${expirationTimestamp}/${token}`;
	} catch (e) {
		console.error(e);
	}
}

export async function createResetLink(email) {
	try {
		const { user } = await import("../user/user.js");
		// check to see if a user exists with that email
		const foundUser = await user.findOne({
			"email.address": email,
		});
		console.log('foundUser', foundUser);

		// if user exists
		if (foundUser) {
			// create email link
			const link = await createResetEmailLink(email);
			return link;
		}

		return '';
	} catch (e) {
		console.error("e", e);
		return false;
	}
}

export async function validateResetEmail(token, email, expirationTimestamp) {
	try {
		// create a hash aka token
		const resetToken = createResetToken(email, expirationTimestamp);

		// compare hash with token
		const isTokenValid = resetToken === token;

		// time is not expired
		const isTimestampValid = validateExpirationTimestamp(expirationTimestamp);
		return isTokenValid && isTimestampValid;
	} catch (e) {
		console.log('e', e);
		return false;
	}
}
