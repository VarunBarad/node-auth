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
import { getUserFromCookies } from './accounts/user.js';
import { logUserOut } from './accounts/logUserOut.js';

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
				const userId = await registerUser(request.body.email, request.body.password);
				if (userId) {
					await logUserIn(userId, request, reply);
					reply.send({
						data: {
							status: 'SUCCESS',
							userId: userId,
						},
					});
				}
			} catch (e) {
				console.error(e);
				reply.send({
					data: {
						status: 'FAILED',
						userId: null,
					},
				});
			}
		});

		app.post('/api/authorize', {}, async (request, reply) => {
			try {
				const { isAuthorized, userId } = await authorizeUser(request.body.email, request.body.password);

				if (isAuthorized) {
					await logUserIn(userId, request, reply);
					reply.send({
						data: {
							status: 'SUCCESS',
							userId: userId,
						},
					});
				} else {
					reply.send({
						data: {
							status: 'FAILED',
							userId: null,
						},
					});
				}
			} catch (e) {
				console.error(e);
				reply.send({
					data: {
						status: 'FAILED',
						userId: null,
					},
				});
			}
		});

		app.post('/api/logout', {}, async (request, reply) => {
			try {
				await logUserOut(request, reply);
				reply.send({
					data: {
						status: 'SUCCESS',
						userId: null,
					},
				});
			} catch (e) {
				console.error(e);
				reply.send({
					data: {
						status: 'FAILED',
						userId: null,
					},
				});
			}
		});

		app.get('/test', {}, async (request, reply) => {
			try {
				// verify user login
				const user = await getUserFromCookies(request, reply);
				// return user email, if it exists, otherwise return unauthorized
				if (user?._id) {
					reply.send({
						data: user,
					});
				} else {
					reply.send({
						data: 'User lookup failed',
					});
				}
			} catch (e) {
				throw new Error(e);
			}
		});

		await app.listen({ port: 3000 }, (err, address) => {
			if (err) {
				throw err;
			}
			console.log(`🚀 Server is running on ${address}`);
		});
	} catch (err) {
		console.error(err);
	}
}

connectDatabase().then(() => {
	startApp().then();
});
