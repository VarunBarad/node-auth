import { client } from '../db.js';

export const user = client.db('authdb').collection('user');
