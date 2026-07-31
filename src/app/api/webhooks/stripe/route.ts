import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const processedEventIds = new Set<string>()

export async function POST(request: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!webhookSecret || !secretKey) {
    console.warn('[stripe/webhook] Running in simulation mode — missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY')
    return NextResponse.json({ received: true, simulated: true }, { status: 200 })
  }

  let rawBody: string
  try {
    const buffer = await request.arrayBuffer()
    rawBody = Buffer.from(buffer).toString('utf-8')
  } catch (err) {
    console.error('[stripe/webhook] Failed to read request body:', err)
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 })
  }

  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.warn('[stripe/webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const stripeClient = new Stripe(secretKey)

  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe/webhook] Signature verification failed:', msg)
    return NextResponse.json({ error: `Webhook Signature Verification Failed: ${msg}` }, { status: 400 })
  }

  if (processedEventIds.has(event.id)) {
    console.log(`[stripe/webhook] Duplicate event skipped: ${event.id}`)
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
  }

  processedEventIds.add(event.id)

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`[stripe/webhook] PaymentIntent succeeded: ${paymentIntent.id}`)
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn(`[stripe/webhook] PaymentIntent failed: ${paymentIntent.id}`)
      break
    }
    default: {
      console.log(`[stripe/webhook] Unhandled event type: ${event.type}`)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
