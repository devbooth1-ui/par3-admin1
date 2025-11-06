import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || '';
const stripe = new Stripe(SECRET || '', { apiVersion: '2024-06-20' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // simple CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!SECRET) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
  if (req.method === 'GET') return res.status(200).json({ ok: true });

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const amount = Number(body.amount ?? 100); // cents
      const currency = String(body.currency ?? 'usd');

      const intent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: {
          courseId: String(body.courseId || ''),
          playerEmail: String(body.playerEmail || ''),
        },
      });

      return res.status(200).json({ clientSecret: intent.client_secret });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || 'Stripe error' });
    }
  }

  res.setHeader('Allow', 'GET,POST,OPTIONS');
  return res.status(405).end();
}
