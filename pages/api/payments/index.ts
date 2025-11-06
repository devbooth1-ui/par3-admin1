import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
if (!STRIPE_SECRET_KEY) {
  // Build/runtime safety — surfaces clear error in logs
  console.error('Missing STRIPE_SECRET_KEY env var');
}

const stripe = new Stripe(STRIPE_SECRET_KEY); // use dashboard default API version

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // expected body: { amountCents: number, currency?: string, metadata?: Record<string,string> }
    const { amountCents, currency = 'usd', metadata = {} } =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    if (!amountCents || typeof amountCents !== 'number' || amountCents < 50) {
      return res.status(400).json({ error: 'amountCents >= 50 required' });
    }

    const pi = await stripe.paymentIntents.create({
      amount: Math.floor(amountCents), // integer cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return res.status(200).json({ clientSecret: pi.client_secret });
  } catch (err: any) {
    console.error('payments.api error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Stripe error' });
  }
}
