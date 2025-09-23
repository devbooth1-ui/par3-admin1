export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { email, password } = req.body

    // Simple authentication - in production use proper auth
    if (email === 'admin@par3challenge.com' && password === 'admin123') {
        res.status(200).json({ success: true, token: 'admin-token', role: 'admin', email })
    } else if (email === 'staff@par3challenge.com' && password === 'staff123') {
        res.status(200).json({ success: true, token: 'staff-token', role: 'staff', email })
    } else {
        res.status(401).json({ message: 'Invalid credentials' })
    }
}
