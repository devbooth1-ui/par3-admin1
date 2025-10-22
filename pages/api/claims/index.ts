import type { NextApiRequest, NextApiResponse } from 'next';

type Claim = {
  id: string;
  createdAt: string;
  playerId: string;
  playerName: string;
  courseId: string;
  courseName: string;
  hole: number;
  result: 'birdie' | 'hio' | string;
  teeTime: string;
  outfit: string;
  videoRef: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
};

const g: any = global as any;
if (!g.__CLAIMS_DB__) g.__CLAIMS_DB__ = { claims: [] as Claim[] };
const db = g.__CLAIMS_DB__ as { claims: Claim[] };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { playerId, playerName, courseId, courseName, hole, result, teeTime, outfit, videoRef, notes } = req.body || {};
    if (!playerId || !courseId || typeof hole !== 'number' || !result) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: playerId, courseId, hole(number), result' });
    }
    const claim: Claim = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      playerId,
      playerName: playerName || '',
      courseId,
      courseName: courseName || '',
      hole,
      result,
      teeTime: teeTime || '',
      outfit: outfit || '',
      videoRef: videoRef || '',
      notes: notes || '',
      status: 'pending',
    };
    db.claims.push(claim);
    return res.status(200).json({ ok: true, claim });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.claims.slice().reverse());
  }

  res.setHeader('Allow', 'GET,POST,OPTIONS');
  return res.status(405).end();
}
