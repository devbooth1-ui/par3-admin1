import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function getClient() {
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Add your prod frontend domain as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // --- END CORS ---

  if (req.method === 'GET') {
    // Fetch the most recently added tournament
    try {
      const client = await getClient();
      const db = client.db();
      const tournament = await db.collection('tournaments').find().sort({ _id: -1 }).limit(1).toArray();
      await client.close();
      res.status(200).json({ tournament: tournament[0] || null });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
