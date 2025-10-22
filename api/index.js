// Main API endpoint for Par3 Challenge
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'https://par3-challenge-app-tailwind-1x33y6kcb-dev-booths-projects.vercel.app',
        'https://par3challenge.com',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// In-memory storage
let courses = [
    {
        id: 'default',
        name: 'Default Course',
        pricing: {
            base_price: 8.00,
            birdie_prize: 65.00,
            hole_in_one_prize: 1000.00
        }
    },
    {
        id: 'premium',
        name: 'Premium Course',
        pricing: {
            base_price: 12.00,
            birdie_prize: 100.00,
            hole_in_one_prize: 2000.00
        }
    }
];

let players = [];
let claims = [];
let payments = [];

// API Routes

// Course pricing endpoint
app.get('/api/courses', (req, res) => {
    console.log('📋 Courses requested');
    res.json({ 
        success: true, 
        courses: courses.map(c => ({
            id: c.id,
            name: c.name,
            pricing: c.pricing
        }))
    });
});

app.get('/api/courses/:courseId/pricing', (req, res) => {
    const { courseId } = req.params;
    console.log(`💰 Pricing requested for course: ${courseId}`);
    
    const course = courses.find(c => c.id === courseId) || courses[0];
    res.json({ 
        success: true, 
        course_id: courseId,
        pricing: course.pricing
    });
});

// Player management
app.post('/api/players', (req, res) => {
    const playerData = req.body;
    console.log('👤 Player sync:', playerData.email);
    
    const existingPlayerIndex = players.findIndex(p => p.email === playerData.email);
    
    if (existingPlayerIndex >= 0) {
        // Update existing player
        players[existingPlayerIndex] = { 
            ...players[existingPlayerIndex], 
            ...playerData, 
            updated_at: new Date().toISOString() 
        };
        res.json({ ok: true, player: players[existingPlayerIndex] });
    } else {
        // Create new player
        const newPlayer = {
            id: Date.now().toString(),
            ...playerData,
            created_at: new Date().toISOString(),
            total_spent: 0,
            games_played: 0
        };
        players.push(newPlayer);
        res.json({ ok: true, player: newPlayer });
    }
});

// Payment tracking
app.post('/api/payments/track', (req, res) => {
    const { email, amount, course_id, payment_method, metadata } = req.body;
    console.log(`💳 Payment tracked: $${amount} for ${email}`);
    
    const payment = {
        id: Date.now().toString(),
        email,
        amount: parseFloat(amount),
        course_id: course_id || 'default',
        payment_method,
        metadata: metadata || {},
        created_at: new Date().toISOString()
    };
    
    payments.push(payment);
    
    // Update player stats
    const player = players.find(p => p.email === email);
    if (player) {
        player.total_spent = (player.total_spent || 0) + payment.amount;
        player.games_played = (player.games_played || 0) + 1;
        player.last_played = new Date().toISOString();
    }
    
    res.json({ success: true, payment });
});

// Claims submission
app.post('/api/claims', (req, res) => {
    const claimData = req.body;
    console.log('🏆 Claim submitted:', claimData.claim_type);
    
    const claim = {
        id: Date.now().toString(),
        ...claimData,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        wallet_address: null
    };
    
    claims.push(claim);
    
    res.json({
        success: true,
        claim_id: claim.id,
        message: 'Claim submitted successfully'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Par3 Challenge API is running',
        timestamp: new Date().toISOString(),
        stats: {
            players: players.length,
            claims: claims.length,
            payments: payments.length,
            courses: courses.length
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Par3 Challenge API',
        version: '1.0.0',
        endpoints: [
            'GET /api/health',
            'GET /api/courses',
            'GET /api/courses/:id/pricing', 
            'POST /api/players',
            'POST /api/payments/track',
            'POST /api/claims'
        ]
    });
});

// For Vercel
module.exports = (req, res) => {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    return app(req, res);
};
