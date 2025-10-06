import type { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo, Claim, Player } from '../../lib/mongo';
import { cors, runMiddleware } from './_cors';
import { generateQRCode } from '../../lib/qr';

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
            let qrCode = null;
            if (player) {
                let points = 50;
                let qualified = false;
                if (claimData.claimType === 'birdie') {
                    points += 200;
                    // Generate QR code for birdie claims only
                    const qrData = JSON.stringify({
                        claimId: result._id,
                        playerEmail: normalizedEmail,
                        playerName: player.playerName,
                        courseId: claimData.courseId,
                        courseName: claimData.courseName,
                        awardType: claimData.claimType,
                        claimDate: result.submitted_at,
                        awardAmount: 65
                    });
                    qrCode = await generateQRCode(qrData);
                } else if (claimData.claimType === 'hole in one') {
                    points = 800;
                    qualified = true;
                    // No QR code for hole in one claims
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
            res.status(201).json({ success: true, id: result._id, qrCode });
        } else if (req.method === 'GET') {
            const allClaims = await Claim.find({});
            res.status(200).json({ success: true, claims: allClaims });
        } else if (req.method === 'DELETE') {
            const { _id } = req.body;
            if (!_id) {
                return res.status(400).json({ error: 'Missing required field: _id' });
            }
            try {
                const result = await Claim.deleteOne({ _id });
                if (result.deletedCount === 1) {
                    return res.status(200).json({ success: true });
                } else {
                    return res.status(404).json({ error: 'Claim not found' });
                }
            } catch (error: any) {
                return res.status(500).json({ success: false, error: error.message });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}
