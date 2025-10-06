import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from './_cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        // Handle special submission logic here
        res.status(200).json({ success: true, message: 'Special received' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
