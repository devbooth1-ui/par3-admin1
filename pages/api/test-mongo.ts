import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debug: print env var
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGODB_URI is not set in environment variables.' });
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    // List collections as a simple test
    const collections = await db.listCollections().toArray();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
}
