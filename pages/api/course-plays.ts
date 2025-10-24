import type { NextApiRequest, NextApiResponse } from 'next';

// CORS helper function
function setCORS(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

// In-memory storage for course plays (replace with database in production)
let coursePlays: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  setCORS(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Record a new course play
      const playData = req.body;
      
      const coursePlay = {
        id: Date.now().toString(),
        ...playData,
        recorded_at: new Date().toISOString(),
        status: 'active'
      };

      coursePlays.push(coursePlay);
      
      console.log('🏌️ New course play recorded:', coursePlay);
      
      return res.status(201).json({
        success: true,
        message: 'Course play recorded successfully',
        play_id: coursePlay.id,
        data: coursePlay
      });
      
    } else if (req.method === 'GET') {
      // Get all course plays
      return res.status(200).json({
        success: true,
        plays: coursePlays,
        total: coursePlays.length
      });
      
    } else {
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowed_methods: ['GET', 'POST', 'OPTIONS'] 
      });
    }
    
  } catch (error) {
    console.error('Course plays API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
