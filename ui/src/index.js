import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
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
