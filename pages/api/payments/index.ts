import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency = 'usd', playerEmail = '', playerName = '', courseId = '' } = req.body;
    if (!amount || typeof amount !== 'number') return res.status(400).json({ message: 'Invalid amount' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents, e.g. 800 for $8.00
      currency,
      metadata: { playerEmail, playerName, courseId },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('create-payment-intent error', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
