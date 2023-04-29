import { client } from '../db.js';

export const session = client.db('authdb').collection('session');

await session.createIndex({ sessionToken: 1 });
