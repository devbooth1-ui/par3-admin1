import type { NextApiRequest, NextApiResponse } from 'next'

type Claim = {
  id: string
  claimType: string
  playerName: string
  playerEmail: string
  playerPhone: string
  outfitDescription: string
  teeTime: string
  courseId: string
  hole: string | number
  paymentMethod: string
  status: 'pending' | 'verified' | 'rejected'
  submitted_at?: string
  wallet_address?: string
  mediaUrl?: string
  clubId?: string
  [key: string]: any // Allows extra/future fields
}

// Simple in-memory store; replace with DB for production!
let claims: Claim[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Change/add your frontend prod URL as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // --- END CORS ---

  if (req.method === 'GET') {
    res.status(200).json(claims)
  } else if (req.method === 'POST') {
    // Accept all claim fields, add id/status/submitted_at
    const newClaim: Claim = {
      ...req.body,
      id: Math.random().toString(36).slice(2),
      status: 'pending',
      submitted_at: new Date().toISOString(),
    }
    claims.push(newClaim)
    res.status(201).json(newClaim)
  } else if (req.method === 'PATCH') {
    // Update claim status (and any other fields you want)
    const { id } = req.query
    const { status, ...rest } = req.body
    const idx = claims.findIndex(c => c.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    claims[idx].status = status
    Object.assign(claims[idx], rest) // Update any other fields provided
    res.status(200).json(claims[idx])
  } else {
    res.status(405).end()
  }
}
