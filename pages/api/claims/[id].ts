import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (req.method === 'PATCH') {
        const { status, notes } = req.body

        // In a real implementation, you would update the database
        // For now, we'll just return success
        console.log(`✅ Claim ${id} updated to ${status}`)
        if (notes) {
            console.log(`📝 Notes: ${notes}`)
        }

        res.status(200).json({
            success: true,
            message: `Claim ${id} updated successfully`
        })
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}
