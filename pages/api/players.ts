import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'par3';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(MONGODB_URI, { });
  cachedClient = client;
  return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!MONGODB_URI) return res.status(500).json({ error: 'Missing MONGODB_URI env var' });

  const client = await connectToDatabase();
  const db = client.db(MONGODB_DB);
  const players = db.collection('players');

  if (req.method === 'GET') {
    try {
      const allPlayers = await players.find({}).toArray();
      return res.status(200).json(allPlayers);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch players' });
    }
  }

  if (req.method === 'POST') {
    const { name, email, phone, stats } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields: name, email' });
    }

    try {
      // Check if player exists
      let player = await players.findOne({ email });

      if (player) {
        // Update player stats
        await players.updateOne(
          { email },
          { $set: { name, phone, stats } }
        );
        player = await players.findOne({ email });
      } else {
        // Insert new player
        const result = await players.insertOne({ name, email, phone, stats });
        player = await players.findOne({ _id: result.insertedId });
      }

      return res.status(200).json(player);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save player' });
    }
  }

  if (req.method === 'PUT') {
    const { _id, stats } = req.body;
    if (!_id || !stats) {
      return res.status(400).json({ error: 'Missing required fields: _id, stats' });
    }
    try {
      await players.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { stats } }
      );
      const player = await players.findOne({ _id: new ObjectId(_id) });
      return res.status(200).json(player);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update player stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
