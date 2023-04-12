import './env.js';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';

// __dirname is not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
	try {
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
				const userId = await authorizeUser(request.body.email, request.body.password);
				reply.send({ userId: userId });
			} catch (e) {
				console.error(e);
			}
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
