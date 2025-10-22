const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'par3-admin-secret-key-2024';

// CORS configuration for production
const corsOptions = {
    origin: [
        'https://par3-challenge-app-tailwind-1x33y6kcb-dev-booths-projects.vercel.app',
        'https://par3challenge.com',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Methods'],
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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
let courses = [
    {
        id: 'default',
        name: 'Default Course',
        pricing: {
            base_price: 8.00,
            birdie_prize: 65.00,
            hole_in_one_prize: 1000.00
        }
    }
];
let payments = [];
let emailCampaigns = [];

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

// API Routes

// Courses API
app.get('/api/courses', (req, res) => {
    res.json({ success: true, courses });
});

app.get('/api/courses/:courseId/pricing', (req, res) => {
    const { courseId } = req.params;
    const course = courses.find(c => c.id === courseId) || courses[0];
    res.json({ 
        success: true, 
        pricing: course.pricing 
    });
});

// Players API
app.get('/api/players', authenticateToken, (req, res) => {
    res.json({ success: true, players });
});

app.post('/api/players', (req, res) => {
    const { player } = req.body;
    const existingPlayerIndex = players.findIndex(p => p.email === player.email);
    
    if (existingPlayerIndex >= 0) {
        // Update existing player
        players[existingPlayerIndex] = { ...players[existingPlayerIndex], ...player, updated_at: new Date().toISOString() };
        res.json({ success: true, player: players[existingPlayerIndex] });
    } else {
        // Create new player
        const newPlayer = {
            id: Date.now().toString(),
            ...player,
            created_at: new Date().toISOString()
        };
        players.push(newPlayer);
        res.json({ success: true, player: newPlayer });
    }
});

// Payments API
app.post('/api/payments/track', (req, res) => {
    const { payment } = req.body;
    const newPayment = {
        id: Date.now().toString(),
        ...payment,
        created_at: new Date().toISOString()
    };
    payments.push(newPayment);
    
    // Update player stats if player exists
    const player = players.find(p => p.email === payment.email);
    if (player) {
        player.total_spent = (player.total_spent || 0) + payment.amount;
        player.games_played = (player.games_played || 0) + 1;
        player.last_played = new Date().toISOString();
    }
    
    res.json({ success: true, payment: newPayment });
});

// Claims API
app.get('/api/claims', authenticateToken, (req, res) => {
    res.json({ success: true, claims });
});

app.post('/api/claims', (req, res) => {
    const claimData = req.body;
    console.log('🏆 Admin API Claim submitted:', claimData);
    
    // Validate required fields
    const { playerId, courseId, hole, result } = claimData;
    
    if (!playerId || !courseId || !hole || !result) {
        return res.status(400).json({
            ok: false,
            error: `Missing required fields: playerId, courseId, hole(number), result`
        });
    }
    
    // Ensure hole is a number
    const holeNumber = parseInt(hole);
    if (isNaN(holeNumber) || holeNumber < 1 || holeNumber > 18) {
        return res.status(400).json({
            ok: false,
            error: 'Hole must be a number between 1 and 18'
        });
    }
    
    const claim = {
        id: Date.now().toString(),
        playerId,
        courseId, 
        hole: holeNumber,
        result,
        // Include all additional data
        ...claimData,
        status: 'pending',
        created_at: new Date().toISOString(),
        wallet_address: null
    };
    
    claims.push(claim);
    console.log('New claim added:', claim);
    console.log('Total claims:', claims.length);
    
    res.json({
        ok: true,
        success: true,
        claim_id: claim.id,
        message: 'Claim submitted successfully'
    });
});

// Email Campaigns API
app.post('/api/email/send', (req, res) => {
    const { campaign } = req.body;
    const newCampaign = {
        id: Date.now().toString(),
        ...campaign,
        sent_at: new Date().toISOString(),
        status: 'sent'
    };
    emailCampaigns.push(newCampaign);
    
    console.log('📧 Email campaign sent:', newCampaign.subject);
    res.json({ success: true, campaign: newCampaign });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Par3 Challenge Admin API is running',
        timestamp: new Date().toISOString(),
        stats: {
            players: players.length,
            claims: claims.length,
            payments: payments.length,
            courses: courses.length
        }
    });
});

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
    // Set CORS headers for preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Handle all API routes through express app
    return app(req, res);
};
