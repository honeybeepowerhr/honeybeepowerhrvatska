import { type NextRequest, NextResponse } from 'next/server'
import { validateNewsletterEmail } from '@/features/newsletter/schema'
import { sendEmail } from '@/lib/resend/client'

/**
 * POST /api/newsletter
 *
 * Validates email with RFC 5322 schema, adds to newsletter list and sends promo coupon code.
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

  const { email } = body ?? {}
  const validation = validateNewsletterEmail(email ?? '')

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    )
  }

  const cleanEmail = email.trim().toLowerCase()

  // Send confirmation email via Resend
  await sendEmail({
    to: cleanEmail,
    subject: 'Dobrodošli u Honey Bee Power Newsletter!',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Hvala vam na prijavi na Honey Bee Power newsletter!</h2>
        <p>Pratite naše najnovije obavijesti, akcije i savjete za sportske performanse.</p>
        <hr/>
        <p style="font-size: 12px; color: #888;">Planet Bio d.o.o. | Krndijska ulica 4, 31500 Našice</p>
      </div>
    `,
  })

  return NextResponse.json({
    success: true,
    message: 'Uspješno ste se prijavili na newsletter!',
  })
}
