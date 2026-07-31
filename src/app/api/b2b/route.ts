import { type NextRequest, NextResponse } from 'next/server'
import { validateB2BForm } from '@/features/b2b/schema'
import { sendEmail } from '@/lib/resend/client'
import { sanityServerClient } from '@/lib/sanity/client'
import { saveInquiryToBackup } from '@/lib/inquiries-backup'

/**
 * POST /api/b2b
 *
 * Receives B2B partner application form data, validates it, stores it in Sanity
 * as an `inquiry` document (inquiryType: 'b2b'), and emails info@planetbio.hr.
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

  const validation = validateB2BForm(body)

  if (!validation.success) {
    return NextResponse.json(
      { success: false, errors: validation.errors },
      { status: 400 },
    )
  }

  const { companyName, contactPerson, email, phone, cooperationType, message } = validation.data!

  const orderNumber = `B2B-${Date.now()}`
  const createdAt = new Date().toISOString()

  // Save local backup copy
  saveInquiryToBackup({
    inquiryType: 'b2b',
    orderNumber,
    status: 'novo',
    customer: {
      fullName: `${contactPerson} (${companyName})`,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    },
    notes: `[Vrsta suradnje: ${cooperationType}]\nTvrtka: ${companyName}\n\n${message}`,
    createdAt,
  })

  let savedToSanity = true
  try {
    await sanityServerClient.create({
      _type: 'inquiry',
      inquiryType: 'b2b',
      orderNumber,
      status: 'novo',
      customer: {
        fullName: `${contactPerson} (${companyName})`,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      notes: `[Vrsta suradnje: ${cooperationType}]\nTvrtka: ${companyName}\n\n${message}`,
      createdAt,
    })
  } catch (err) {
    savedToSanity = false
    console.error('[b2b] Failed to save B2B inquiry to Sanity:', err)
  }

  // Send notification email to info@planetbio.hr
  const emailResult = await sendEmail({
    to: 'info@planetbio.hr',
    subject: `[B2B Upit] Nova prijava za suradnju: ${companyName} (${orderNumber})`,
    html: `
      <h2>Novi B2B zahtjev za suradnju</h2>
      <p><strong>Broj upita:</strong> ${orderNumber}</p>
      <p><strong>Tvrtka/Obrt:</strong> ${companyName}</p>
      <p><strong>Kontakt osoba:</strong> ${contactPerson}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Vrsta suradnje:</strong> ${cooperationType}</p>
      <p><strong>Poruka:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #f59e0b;">
        ${message}
      </blockquote>
    `,
  })

  if (!savedToSanity && !emailResult.success) {
    console.error('[b2b] Both Sanity save and owner email failed:', emailResult.error)
    return NextResponse.json(
      { success: false, error: 'Slanje B2B zahtjeva nije uspjelo. Pokušajte ponovno.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Vaš B2B zahtjev je uspješno poslan. Kontaktirat ćemo vas u najkraćem mogućem roku!',
  })
}
