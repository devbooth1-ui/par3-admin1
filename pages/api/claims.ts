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

const allowedOrigins = [
  'https://par3-challenge-app-tailwind.vercel.app',
  'https://par3-challenge-app-tailwind-gpoj509m0-dev-booths-projects.vercel.app',
  'https://par3-admin1.vercel.app',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(claims)
  } else if (req.method === 'POST') {
    // Accept all claim fields, add id/status/submitted_at
    const {
      claimType = "",
      playerName = "",
      playerEmail = "",
      outfitDescription = "",
      teeTime = "",
      courseId = "",
      hole = "",
      paymentMethod = "",
      playerPhone = "",
      ...rest
    } = req.body || {};

    // Robust validation for Birdie/HIO claims
    if (
      ["birdie", "hole-in-one", "hio"].includes(claimType.toLowerCase())
    ) {
      if (
        !playerName.trim() ||
        !playerEmail.trim() ||
        !outfitDescription.trim() ||
        !teeTime.trim() ||
        !courseId.trim() ||
        !hole
      ) {
        return res.status(400).json({
          error: 'Missing required fields for Birdie/HIO: playerName, playerEmail, outfitDescription, teeTime, courseId, hole'
        });
      }
    } else {
      // For other claim types, just require playerName and playerEmail
      if (!playerName.trim() || !playerEmail.trim()) {
        return res.status(400).json({
          error: 'Missing required fields: playerName, playerEmail'
        });
      }
    }

    // Optional: Validate email format
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(playerEmail.trim())) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const newClaim: Claim = {
      id: Math.random().toString(36).slice(2),
      claimType: claimType.trim(),
      playerName: playerName.trim(),
      playerEmail: playerEmail.trim(),
      playerPhone: playerPhone.trim(),
      outfitDescription: outfitDescription.trim(),
      teeTime: teeTime.trim(),
      courseId: courseId.trim(),
      hole,
      paymentMethod: paymentMethod.trim(),
      status: 'pending',
      submitted_at: new Date().toISOString(),
      ...rest // include any extra fields
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
    Object.assign(claims[idx], rest)
    res.status(200).json(claims[idx])
  } else {
    res.status(405).end()
  }
}
