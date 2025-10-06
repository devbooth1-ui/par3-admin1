import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { cors, runMiddleware } from './_cors';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'par3';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = await MongoClient.connect(MONGODB_URI, {});
    cachedClient = client;
    return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

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
        const { name, email, phone, stats, claim, courseId } = req.body;
        const normalizedEmail = (email || '').toLowerCase().trim();
        if (!name || !normalizedEmail) {
            return res.status(400).json({ error: 'Missing required fields: name, email' });
        }
        try {
            let player = await players.findOne({ email: normalizedEmail });

            if (player) {
                // Update player info and push claim/course if provided
                let update: any = { $set: { name, phone, stats } };
                if (claim) update.$push = { claims: claim };
                if (courseId) {
                    if (!update.$push) update.$push = {};
                    update.$push.coursesPlayed = courseId;
                }
                await players.updateOne({ email: normalizedEmail }, update);
                player = await players.findOne({ email: normalizedEmail });
            } else {
                // Insert new player with claims/courses arrays
                const newPlayer: any = {
                    name,
                    email: normalizedEmail,
                    phone,
                    stats,
                    claims: claim ? [claim] : [],
                    coursesPlayed: courseId ? [courseId] : []
                };
                const result = await players.insertOne(newPlayer);
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