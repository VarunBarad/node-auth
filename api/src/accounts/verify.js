import crypto from "crypto";

const rootDomain = process.env.ROOT_DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

export async function createVerifyEmailToken(email) {
	try {
		const authString = `${jwtSecret}:${email}`;
		return crypto.createHash("sha256").update(authString).digest("hex");
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

export async function validateVerifyEmail(token, email) {
	try {
		// create a hash aka token
		const emailToken = await createVerifyEmailToken(email);

		// compare has with token
		const isValid = emailToken === token;

		if (isValid) {
			//update user to mark them verified
			const { user } = await import("../user/user.js");
			await user.updateOne({
				"email.address": email
			}, {
				$set: {
					"email.verified": true
				}
			});

			return true;
		} else {
			return false;
		}
	} catch (e) {
		console.error("e", e);
		return false;
	}
}
