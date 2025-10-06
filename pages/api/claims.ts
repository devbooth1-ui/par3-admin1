import type { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo, Claim, Player } from '../../lib/mongo';
import { cors, runMiddleware } from './_cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    await connectMongo();
    try {
        if (req.method === 'POST') {
            const claimData = req.body;
            const normalizedEmail = (claimData.playerEmail || '').toLowerCase().trim();
            // Use normalizedEmail for all lookups and inserts
            const result = await Claim.create({ ...claimData, playerEmail: normalizedEmail });

            // Find player by email
            const player = await Player.findOne({ playerEmail: normalizedEmail });
            if (player) {
                let points = 50;
                let qualified = false;
                if (claimData.claimType === 'birdie') {
                    points += 200;
                } else if (claimData.claimType === 'hole in one') {
                    points = 800;
                    qualified = true;
                }
                // Update player record
                await Player.updateOne(
                    { playerEmail: normalizedEmail },
                    {
                        $push: {
                            awards: claimData.claimType,
                            coursesPlayed: claimData.courseId
                        },
                        $inc: { points: points },
                        ...(qualified && { qualifiedForMillion: true })
                    }
                );
            }
            res.status(201).json({ success: true, id: result._id });
        } else if (req.method === 'GET') {
            const allClaims = await Claim.find({});
            res.status(200).json({ success: true, claims: allClaims });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}
