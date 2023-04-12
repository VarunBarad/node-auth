import bcrypt from 'bcryptjs';
const { compare } = bcrypt;

export async function authorizeUser(email, password) {
	const { user } = await import('../user/user.js');

	const userData = await user.findOne({ 'email.address': email });
	console.log(userData);

	const savedPassword = userData.password;

	const isAuthorized = await compare(password, savedPassword);
	console.log('isAuthorized', isAuthorized);

	return isAuthorized;
}
