import { type NextRequest, NextResponse } from 'next/server'
import { globalAbandonedCartTracker } from '@/lib/resend/abandoned-cart'

/**
 * POST /api/abandoned-cart
 *
 * Action: 'register' -> Registers checkout attempt for email recovery (1h & 24h emails)
 * Action: 'completed' -> Cancels scheduled emails when user completes purchase
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: any

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Neispravan JSON u tijelu zahtjeva.' },
      { status: 400 },
    )
  }

  const { action, email, checkoutId, items } = body ?? {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json(
      { success: false, error: 'Valjana email adresa je obavezna.' },
      { status: 400 },
    )
  }

  if (action === 'completed') {
    const cancelledCount = globalAbandonedCartTracker.cancelScheduledEmailsForEmail(email)
    return NextResponse.json({
      success: true,
      message: `Zakazani abandoned cart emailovi su otkazani (${cancelledCount}).`,
    })
  }

  if (action === 'register') {
    const id = checkoutId || `checkout_${Date.now()}`
    const session = globalAbandonedCartTracker.registerCheckout(
      id,
      email,
      Array.isArray(items) ? items : [],
    )

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      scheduledEmailCount: session.scheduledEmails.length,
    })
  }

  return NextResponse.json(
    { success: false, error: 'Neispravna akcija. Koristite "register" ili "completed".' },
    { status: 400 },
  )
}
