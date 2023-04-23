import './env.js';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';
import { logUserIn } from './accounts/logUserIn.js';

// __dirname is not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
	try {
		app.register(fastifyCookie, {
			secret: process.env.COOKIE_SECRET,
		});

		app.register(fastifyStatic, {
			root: path.join(__dirname, 'public'),
		});

		app.post('/api/register', {}, async (request, reply) => {
			try {
				console.log('request', request.body);
				const userId = await registerUser(request.body.email, request.body.password);
				reply.send({ userId: userId });
			} catch (e) {
				console.error(e);
			}
		});

		app.post('/api/authorize', {}, async (request, reply) => {
			try {
				console.log('request', request.body);
				const { isAuthorized, userId } = await authorizeUser(request.body.email, request.body.password);

				if (isAuthorized) {
					await logUserIn(userId, request, reply);
				}

				reply
					.setCookie('testCookie', 'the value is the second parameter', {
						path: '/',
						domain: 'localhost',
						httpOnly: true,
					})
					.send({ userId: isAuthorized });
			} catch (e) {
				console.error(e);
			}
		});

		app.get('/test', {}, (request, reply) => {
			console.log(request.cookies.testCookie);
			reply.send({ data: 'booh' });
		});

		await app.listen({ port: 3000 }, (err, address) => {
			if (err) {
				throw err;
			}
			console.log(`🚀 Server is running on ${address}`);
		});
		console.log('Server is running on port 3000');
	} catch (err) {
		console.error(err);
	}
}

connectDatabase().then(() => {
	startApp().then();
});
