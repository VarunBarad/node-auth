import mongo from 'mongodb';

const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

export const client = new MongoClient(url, { useNewUrlParser: true });

export async function connectDatabase() {
	try {
		await client.connect();

		// Confirm connection
		await client.db('admin').command({ ping: 1 });

		console.log('🗄️  Connected to MongoDB');
	} catch (err) {
		console.error('Failed to connect to MongoDB');
		console.error(err);
		await client.close();
	}
}
