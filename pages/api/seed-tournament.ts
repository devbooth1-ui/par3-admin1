import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) return res.status(500).json({ error: 'No MONGODB_URI set' });
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const doc = {
      name: 'Summer Par3 Challenge',
      date: '2025-08-15',
      location: 'Meadow Brook Par 3',
      registration: '34/50',
      insurance: 'Sample Insurance Co.'
    };
    const result = await db.collection('tournaments').insertOne(doc);
    await client.close();
    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
