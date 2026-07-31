import { type NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend/client'
import { sanityServerClient } from '@/lib/sanity/client'
import { saveInquiryToBackup } from '@/lib/inquiries-backup'

const INQUIRY_RECIPIENT = 'info@planetbio.hr'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * POST /api/contact
 *
 * Receives general contact form submissions from /kontakt,
 * stores them in Sanity as an `inquiry` document (inquiryType: 'kontakt'),
 * and sends an email notification to the site owner.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Neispravan JSON u tijelu zahtjeva.' },
      { status: 400 },
    )
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { success: false, error: 'Neispravno tijelo zahtjeva.' },
      { status: 400 },
    )
  }

  const { fullName, email, phone, message } = body as Record<string, unknown>

  if (typeof fullName !== 'string' || !fullName.trim()) {
    return NextResponse.json(
      { success: false, error: 'Molimo unesite vaše ime i prezime.' },
      { status: 400 },
    )
  }

  if (typeof email !== 'string' || !email.trim() || !isValidEmail(email.trim())) {
    return NextResponse.json(
      { success: false, error: 'Molimo unesite ispravnu e-mail adresu.' },
      { status: 400 },
    )
  }

  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json(
      { success: false, error: 'Molimo unesite vašu poruku.' },
      { status: 400 },
    )
  }

  const orderNumber = `KONTAKT-${Date.now()}`
  const createdAt = new Date().toISOString()
  const cleanFullName = fullName.trim()
  const cleanEmail = email.trim().toLowerCase()
  const cleanPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : undefined
  const cleanMessage = message.trim()

  // Save local backup copy
  saveInquiryToBackup({
    inquiryType: 'kontakt',
    orderNumber,
    status: 'novo',
    customer: {
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
    },
    notes: cleanMessage,
    createdAt,
  })

  let savedToSanity = true
  try {
    await sanityServerClient.create({
      _type: 'inquiry',
      inquiryType: 'kontakt',
      orderNumber,
      status: 'novo',
      customer: {
        fullName: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
      },
      notes: cleanMessage,
      createdAt,
    })
  } catch (err) {
    savedToSanity = false
    console.error('[contact] Failed to save inquiry to Sanity:', err)
  }

  const ownerEmailResult = await sendEmail({
    to: INQUIRY_RECIPIENT,
    subject: `[Kontakt Upit] Nova poruka — ${orderNumber}`,
    html: `
      <h2>Nova kontakt poruka</h2>
      <p><strong>Broj upita:</strong> ${orderNumber}</p>
      <p><strong>Ime i prezime:</strong> ${cleanFullName}</p>
      <p><strong>Email:</strong> ${cleanEmail}</p>
      <p><strong>Telefon:</strong> ${cleanPhone ?? '—'}</p>
      <p><strong>Poruka:</strong></p>
      <blockquote style="background:#f9f9f9;padding:12px;border-left:4px solid #f59e0b;">
        ${cleanMessage.replace(/\n/g, '<br/>')}
      </blockquote>
    `,
  })

  if (!savedToSanity && !ownerEmailResult.success) {
    console.error('[contact] Both Sanity save and owner email failed:', ownerEmailResult.error)
    return NextResponse.json(
      { success: false, error: 'Slanje upita nije uspjelo. Pokušajte ponovno.' },
      { status: 500 },
    )
  }

  // Optional confirmation email to customer
  await sendEmail({
    to: cleanEmail,
    subject: `Primili smo vaš upit — ${orderNumber}`,
    html: `
      <p>Bok ${cleanFullName},</p>
      <p>Zahvaljujemo na javljanju. Primili smo vašu poruku i javit ćemo vam se u najkraćem mogućem roku.</p>
      <p>Lijep pozdrav,<br/>Planet Bio / Honey Bee Power tim</p>
    `,
  })

  return NextResponse.json({ success: true, orderNumber })
}
