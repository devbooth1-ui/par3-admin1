import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from './_cors';

const uri = process.env.MONGODB_URI;

async function getClient() {
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    // Fetch the most recently added tournament
    try {
      const client = await getClient();
      const db = client.db();
      const tournament = await db.collection('tournaments').find().sort({ _id: -1 }).limit(1).toArray();
      await client.close();
      res.status(200).json({ tournament: tournament[0] || null });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    // Update or insert tournament
    try {
      const client = await getClient();
      const db = client.db();
      const { _id, ...data } = req.body;
      let result;
      if (_id) {
        result = await db.collection('tournaments').updateOne(
          { _id: new ObjectId(_id) },
          { $set: data }
        );
      } else {
        result = await db.collection('tournaments').insertOne(data);
      }
      await client.close();
      res.status(200).json({ success: true, result });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
