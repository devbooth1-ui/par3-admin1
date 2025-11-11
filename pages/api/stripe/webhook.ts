import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } } // Raw body for Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function readRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    req.on('data', (c: Uint8Array) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end() }

  const sig = req.headers['stripe-signature']
  if (!sig || typeof sig !== 'string') return res.status(400).send('Missing signature')

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET')

  let event: Stripe.Event
  try {
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.log('[WEBHOOK] succeeded', pi.id, pi.amount, pi.currency)
        // TODO: mark claim/order paid in DB
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.log('[WEBHOOK] failed', pi.id, pi.last_payment_error?.message)
        // TODO: record failure
        break
      }
    }
    return res.status(200).json({ received: true })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'handler_error' })
  }
}
