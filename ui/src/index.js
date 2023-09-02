import https from 'https';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fetch from 'cross-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
	try {
		app.register(fastifyStatic, {
			root: path.join(__dirname, 'public'),
		});

		app.get("/reset/:email/:expirationTimestamp/:token", {}, async (request, reply) => {
			return reply.sendFile('reset.html');
		});

		app.get("/2fa", {}, async (request, reply) => {
			return reply.sendFile('2fa.html');
		});

		app.get('/verify/:email/:token', {}, async (request, reply) => {
			try {
				console.log("request", request.params.email, request.params.token);
				const data = {
					email: request.params.email,
					token: request.params.token,
				};

				const httpsAgent = new https.Agent({
					rejectUnauthorized: false,
				});
				const response = await fetch("https://api.nodeauth.varun/api/verify", {
					method: "POST",
					headers: { "Content-Type": "application/json; charset=UTF-8" },
					credentials: 'include',
					agent: httpsAgent,
					body: JSON.stringify(data),
				});
				if (response.status === 200) {
					return reply.redirect('/');
				} else {
					return reply.code(401).send();
				}
			} catch (e) {
				console.log("e", e);
				reply.send({
					data: {
						status: 'FAILED',
					},
				});
			}
		});

		// app.get('/test', {}, async (request, reply) => {
		// 	try {
		// 		// verify user login
		// 		const user = await getUserFromCookies(request, reply);
		// 		// return user email, if it exists, otherwise return unauthorized
		// 		if (user?._id) {
		// 			reply.send({
		// 				data: user,
		// 			});
		// 		} else {
		// 			reply.send({
		// 				data: 'User lookup failed',
		// 			});
		// 		}
		// 	} catch (e) {
		// 		throw new Error(e);
		// 	}
		// });

		await app.listen({ port: 5000 }, (err, address) => {
			if (err) {
				throw err;
			}
			console.log(`🚀 Server is running on ${address}`);
		});
	} catch (err) {
		console.error(err);
	}
}

startApp().then();
