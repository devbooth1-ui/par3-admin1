// Import the claims from the main claims.ts file
import claimsHandler from '../claims'

export default function handler(req, res) {
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
