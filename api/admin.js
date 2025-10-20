const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'par3-admin-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let users = [
    {
        id: 1,
        email: 'admin@par3challenge.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
    }
];

let claims = [];
let players = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Main handler function
const handler = (req, res) => {
    if (req.method === 'POST') {
        const { action } = req.body;

        // Login
        if (action === 'login') {
            const { email, password } = req.body;
            const user = users.find(u => u.email === email);
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
        }

        // Submit claim
        if (action === 'submitClaim') {
            const { claim } = req.body;

            // Create new claim with ID
            const newClaim = {
                id: Date.now().toString(),
                status: 'pending',
                created_at: new Date().toISOString(),
                ...claim
            };

            claims.push(newClaim);
            console.log('New claim added:', newClaim);
            console.log('Total claims:', claims.length);

            return res.json({
                success: true,
                message: 'Claim submitted successfully',
                claimId: newClaim.id
            });
        }

        // Get claims
        if (action === 'getClaims') {
            // Simple auth check
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Access token required' });
            }
            return res.json({ claims });
        }

        // Update claim
        if (action === 'updateClaim') {
            const { claimId, status } = req.body;
            const claim = claims.find(c => c.id === claimId);
            if (!claim) {
                return res.status(404).json({ error: 'Claim not found' });
            }

            claim.status = status;
            claim.updated_at = new Date().toISOString();

            // Generate wallet address for approved claims
            if (status === 'approved' && !claim.wallet_address) {
                claim.wallet_address = `0x${Math.random().toString(16).substr(2, 40)}`;
            }

            return res.json({ success: true, claim });
        }

        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};

// Webhook endpoint for receiving claims from main app
app.post('/api/claims/webhook', (req, res) => {
    const claimData = req.body;

    const claim = {
        id: Date.now().toString(),
        ...claimData,
        status: 'pending',
        submitted_at: claimData.claimed_at || new Date().toISOString(),
        wallet_address: null
    };

    claims.push(claim);
    console.log('New claim received:', claim);

    res.json({
        success: true,
        claim_id: claim.id,
        message: 'Claim submitted successfully'
    });
});

// For Vercel
module.exports = (req, res) => {
    // Handle webhook
    if (req.url === '/api/claims/webhook') {
        return app(req, res);
    }
    // Handle admin actions
    return handler(req, res);
};
