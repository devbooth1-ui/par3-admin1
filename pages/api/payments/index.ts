import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' })

function allowCors(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  allowCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'POST') {
    try {
      const { amount = 800, currency = 'usd' } = (req.body ?? {}) as { amount?: number; currency?: string }
      if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })
      if (!Number.isFinite(amount) || amount < 100) return res.status(400).json({ error: 'amount must be >= 100 (cents)' })

      const intent = await stripe.paymentIntents.create({
        amount,
        currency,
        // This makes backend confirmations with test cards work without return_url
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      })

      return res.status(200).json({ clientSecret: intent.client_secret, id: intent.id })
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'stripe_create_failed' })
    }
  }

  res.setHeader('Allow', 'POST, OPTIONS')
  return res.status(405).end()
}
