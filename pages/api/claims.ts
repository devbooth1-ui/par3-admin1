// This will store claims in memory - in production use a proper database
let claims = [
    {
        id: '1',
        claimType: 'hole_in_one',
        playerName: 'John Smith',
        playerEmail: 'john.smith@email.com',
        playerPhone: '555-0123',
        outfitDescription: 'Navy blue polo, khaki pants, white Nike shoes, red cap',
        teeTime: '2:30 PM',
        courseId: 'wentworth-gc',
        hole: '1',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        prizeAmount: 100000, // $1000 in cents
        paymentMethod: 'credit_card',
        notes: ''
    },
    {
        id: '2',
        claimType: 'birdie',
        playerName: 'Sarah Johnson',
        playerEmail: 'sarah.j@email.com',
        playerPhone: '555-0456',
        outfitDescription: 'Pink golf shirt, black shorts, Adidas golf shoes',
        teeTime: '11:15 AM',
        courseId: 'wentworth-gc',
        hole: '1',
        submittedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        status: 'pending',
        prizeAmount: 6500, // $65 in cents
        paymentMethod: 'paypal',
        notes: ''
    }
]

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Return all claims
        res.status(200).json({ claims })
    } else if (req.method === 'POST') {
        // Add new claim from the main app
        const {
            claimType,
            playerName,
            playerEmail,
            playerPhone,
            outfitDescription,
            teeTime,
            courseId,
            hole,
            paymentMethod
        } = req.body

        const newClaim = {
            id: Date.now().toString(),
            claimType,
            playerName,
            playerEmail,
            playerPhone: playerPhone || '',
            outfitDescription: outfitDescription || 'Not provided',
            teeTime: teeTime || 'Not specified',
            courseId: courseId || 'wentworth-gc',
            hole: hole || '1',
            submittedAt: new Date().toISOString(),
            status: 'pending',
            prizeAmount: claimType === 'hole_in_one' ? 100000 : 6500, // $1000 or $65 in cents
            paymentMethod: paymentMethod || 'card',
            notes: ''
        }

        claims.unshift(newClaim) // Add to beginning

        console.log('🚨 NEW CLAIM RECEIVED:', newClaim)

        res.status(201).json({
            success: true,
            message: 'Claim submitted successfully',
            claim: newClaim
        })
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}
