import type { NextApiRequest, NextApiResponse } from 'next'

type Player = { id: string; name: string; email: string; createdAt: string }
const store: Player[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return res.status(200).json(store)
  if (req.method === 'POST') {
    const { name, email } = req.body || {}
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' })
    if (store.find(p => p.email.toLowerCase() === String(email).toLowerCase()))
      return res.status(409).json({ error: 'player already exists' })
    const player: Player = { id: crypto.randomUUID(), name, email, createdAt: new Date().toISOString() }
    store.push(player)
    return res.status(201).json(player)
  }
  res.setHeader('Allow', 'GET, POST'); res.status(405).end()
}
