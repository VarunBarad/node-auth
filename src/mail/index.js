import nodeMailer from 'nodemailer';

let mail;
export async function mailInit() {
	let testAccount = await nodeMailer.createTestAccount();
	mail = nodeMailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});
}

export async function sendEmail({
	from = 'Fred Foo <fred@nodeauth.varun>',
	to = 'blah@varunbarad.com',
	subject,
	html,
}) {
	try {
		let info = await mail.sendMail({
			from: from,
			to: to,
			subject: subject,
			html: html,
		});
		console.log('info', info);
	} catch (e) {
		console.error(e);
	}
}
