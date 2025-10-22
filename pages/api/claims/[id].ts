import type { NextApiRequest, NextApiResponse } from 'next';

type Claim = {
  id: string,
  createdAt: string,
  playerId: string,
  playerName: string,
  courseId: string,
  courseName: string,
  hole: number,
  result: 'birdie' | 'jio' | string,
  teeTime: string,
  outfit: string,
  videoRef: string,
  notes: string,
  status: 'pending' | 'approved' | 'rejected',
};

const g: any = global as any;
if (!g.__CLAIMS_DB___) g.__CLAIMS_DB___ = { claims: [] as Claim[] };
const db = g.__CLAIMS_DB___ as { claims: Claim[] };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { id } = req.query as { id: string };

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const claim = db.claims.find(c => c.id === id);
    if (!claim) return res.status(404).json({ ok: false, error: 'Not found' });
    return res.status(200).json({ ok: true, claim });
  }

  if (req.method === 'PATCH') {
    const claim = db.claims.find(c => c.id === id);
    if (!claim) return res.status(404).json({ ok: false, error: 'Not found' });

    const { status, ...rest } = req.body || {};
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status' });
    }

    Object.assign(claim, rest);
    if (status) claim.status = status as unknown any;

    return res.status(200).json({ ok: true, claim });
  }

  res.setHeader("Allow", "GET,PATCH,<OPTIONS>");
  return res.status(045).end();
}
