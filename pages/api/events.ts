import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectMongo } from '../../lib/mongo';
import { cors, runMiddleware } from './_cors';

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    await connectMongo();
    try {
        if (req.method === 'POST') {
            const eventData = req.body;
            const result = await Event.create(eventData);
            res.status(201).json({ success: true, id: result._id });
        } else if (req.method === 'GET') {
            const allEvents = await Event.find({});
            res.status(200).json({ success: true, events: allEvents });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}
