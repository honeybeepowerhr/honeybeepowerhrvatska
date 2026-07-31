import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import type { CartItem, DeliveryMethod } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

/** Delivery cost lookup in EUR cents. */
const DELIVERY_COSTS: Record<DeliveryMethod, number> = {
  hp_express: 499,   // 4.99 €
  gls: 399,          // 3.99 €
  overseas: 1299,    // 12.99 €
  pickup: 0,         // free
}

/** Free shipping threshold in EUR cents. */
const FREE_SHIPPING_THRESHOLD = 5000 // 50.00 €

/** Supported promo codes and their discount multipliers. */
const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.10, // 10 % off
}

// ── Request / Response types ──────────────────────────────────────────────────

interface CheckoutRequestBody {
  items: CartItem[]
  deliveryMethod: DeliveryMethod
  promoCode?: string
  email: string
}

interface CheckoutSuccessResponse {
  clientSecret: string
  orderId: string
}

interface CheckoutErrorResponse {
  error: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_DELIVERY_METHODS: DeliveryMethod[] = ['hp_express', 'gls', 'overseas', 'pickup']

function isValidEmail(email: string): boolean {
  // RFC 5322-lite regex — good enough for server-side pre-validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isDeliveryMethod(value: unknown): value is DeliveryMethod {
  return typeof value === 'string' && (VALID_DELIVERY_METHODS as string[]).includes(value)
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.productId === 'string' &&
    typeof obj.variantId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.imageSrc === 'string' &&
    typeof obj.variantLabel === 'string' &&
    typeof obj.unitPrice === 'number' &&
    typeof obj.quantity === 'number' &&
    obj.unitPrice >= 0 &&
    Number.isInteger(obj.quantity) &&
    (obj.quantity as number) > 0
  )
}

function validateBody(raw: unknown): { data: CheckoutRequestBody } | { error: string } {
  if (typeof raw !== 'object' || raw === null) {
    return { error: 'Request body must be a JSON object.' }
  }

  const body = raw as Record<string, unknown>

  // email
  if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
    return { error: 'Invalid or missing email address.' }
  }

  // items
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { error: 'Cart must contain at least one item.' }
  }
  for (const item of body.items) {
    if (!isCartItem(item)) {
      return { error: 'One or more cart items are malformed.' }
    }
  }

  // deliveryMethod
  if (!isDeliveryMethod(body.deliveryMethod)) {
    return { error: `Invalid delivery method. Valid values: ${VALID_DELIVERY_METHODS.join(', ')}.` }
  }

  // promoCode (optional)
  const promoCode =
    typeof body.promoCode === 'string' && body.promoCode.trim() !== ''
      ? body.promoCode.trim().toUpperCase()
      : undefined

  return {
    data: {
      items: body.items as CartItem[],
      deliveryMethod: body.deliveryMethod,
      promoCode,
      email: body.email.trim().toLowerCase(),
    },
  }
}

function calculateTotals(
  items: CartItem[],
  deliveryMethod: DeliveryMethod,
  promoCode?: string,
): {
  subtotal: number
  discountAmount: number
  shippingCost: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const discountRate = promoCode ? (PROMO_CODES[promoCode] ?? 0) : 0
  const discountAmount = Math.round(subtotal * discountRate)

  const discountedSubtotal = subtotal - discountAmount
  const shippingCost =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_COSTS[deliveryMethod]

  const total = discountedSubtotal + shippingCost

  return { subtotal, discountAmount, shippingCost, total }
}

// ── POST /api/checkout ────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CheckoutSuccessResponse | CheckoutErrorResponse>> {
  // 1. Parse body
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // 2. Validate
  const validation = validateBody(rawBody)
  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { items, deliveryMethod, promoCode, email } = validation.data

  // 3. Validate promo code (if provided but not recognized)
  if (promoCode !== undefined && !(promoCode in PROMO_CODES)) {
    return NextResponse.json({ error: `Promo code "${promoCode}" is not valid.` }, { status: 400 })
  }

  // 4. Calculate totals
  const { subtotal, discountAmount, shippingCost, total } = calculateTotals(
    items,
    deliveryMethod,
    promoCode,
  )

  // 5. Create Stripe PaymentIntent
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // already in cents
      currency: 'eur',
      description: `Honey Bee Power order — ${items.length} item(s)`,
      metadata: {
        email,
        deliveryMethod,
        subtotal: String(subtotal),
        discountAmount: String(discountAmount),
        shippingCost: String(shippingCost),
        total: String(total),
        ...(promoCode ? { promoCode } : {}),
        itemCount: String(items.length),
        itemSummary: items
          .slice(0, 5) // Stripe metadata values are max 500 chars
          .map((i) => `${i.name} ×${i.quantity}`)
          .join(', '),
      },
    })

    if (!paymentIntent.client_secret) {
      console.error('[checkout] PaymentIntent created without client_secret', {
        id: paymentIntent.id,
      })
      return NextResponse.json(
        { error: 'Payment initialisation failed. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.id,
    })
  } catch (err) {
    // Log full error server-side, never expose secret details to client
    console.error('[checkout] Stripe PaymentIntent creation failed:', err)
    return NextResponse.json(
      { error: 'Payment service unavailable. Please try again later.' },
      { status: 500 },
    )
  }
}
