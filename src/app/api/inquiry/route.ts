import { type NextRequest, NextResponse } from 'next/server'
import { validateInquiryForm } from '@/features/inquiry/schema'
import { sendEmail } from '@/lib/resend/client'
import { sanityServerClient } from '@/lib/sanity/client'
import { saveInquiryToBackup } from '@/lib/inquiries-backup'
import type { InquiryItem, InquiryRequestBody } from '@/types'

const INQUIRY_RECIPIENT = 'honeybeepower.hr@gmail.com'

function isInquiryItem(value: unknown): value is InquiryItem {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.name === 'string' &&
    typeof obj.variantLabel === 'string' &&
    typeof obj.quantity === 'number' &&
    Number.isInteger(obj.quantity) &&
    obj.quantity > 0 &&
    typeof obj.unitPrice === 'number' &&
    obj.unitPrice >= 0 &&
    typeof obj.imageSrc === 'string'
  )
}

function validateBody(raw: unknown): { data: InquiryRequestBody } | { error: string } {
  if (typeof raw !== 'object' || raw === null) {
    return { error: 'Neispravno tijelo zahtjeva.' }
  }
  const body = raw as Record<string, unknown>

  const customer = body.customer as Record<string, unknown> | undefined
  const shippingAddress = body.shippingAddress as Record<string, unknown> | undefined

  const formErrors = validateInquiryForm({
    fullName: customer?.fullName as string | undefined,
    email: customer?.email as string | undefined,
    phone: customer?.phone as string | undefined,
    address: shippingAddress?.address as string | undefined,
    city: shippingAddress?.city as string | undefined,
    postalCode: shippingAddress?.postalCode as string | undefined,
    country: shippingAddress?.country as string | undefined,
    notes: body.notes as string | undefined,
  })

  if (Object.keys(formErrors).length > 0) {
    return { error: 'Podaci u formi nisu ispravni.' }
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { error: 'Košarica mora sadržavati barem jedan artikl.' }
  }
  for (const item of body.items) {
    if (!isInquiryItem(item)) {
      return { error: 'Jedna ili više stavki košarice nisu ispravne.' }
    }
  }

  return {
    data: {
      customer: {
        fullName: (customer!.fullName as string).trim(),
        email: (customer!.email as string).trim().toLowerCase(),
        phone: customer?.phone ? (customer.phone as string).trim() : undefined,
      },
      shippingAddress: {
        address: (shippingAddress!.address as string).trim(),
        city: (shippingAddress!.city as string).trim(),
        postalCode: (shippingAddress!.postalCode as string).trim(),
        country: (shippingAddress!.country as string).trim().toUpperCase(),
      },
      notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
      items: body.items as InquiryItem[],
    },
  }
}

function formatEur(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

/**
 * POST /api/inquiry
 *
 * Receives a cart + customer/delivery details as a request for a quote
 * (no payment collected). Stores it as a Sanity `inquiry` document and
 * emails the owner so they can reply with final pricing and payment info.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Neispravan JSON u tijelu zahtjeva.' }, { status: 400 })
  }

  const validation = validateBody(rawBody)
  if ('error' in validation) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
  }

  const { customer, shippingAddress, notes, items } = validation.data

  const orderNumber = `HBP-${Date.now()}`
  const createdAt = new Date().toISOString()

  // Save local backup copy
  saveInquiryToBackup({
    inquiryType: 'narudzba',
    orderNumber,
    status: 'novo',
    customer,
    shippingAddress,
    items,
    notes,
    createdAt,
  })

  const itemsWithKeys = items.map((item, idx) => ({
    _key: `item_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
    name: item.name,
    variantLabel: item.variantLabel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    imageSrc: item.imageSrc,
  }))

  // Best-effort: save to Sanity (acts as the admin panel), but don't let a
  // Sanity outage block the email notification — that's the reliable fallback.
  let savedToSanity = true
  try {
    await sanityServerClient.create({
      _type: 'inquiry',
      inquiryType: 'narudzba',
      orderNumber,
      status: 'novo',
      customer,
      shippingAddress,
      items: itemsWithKeys,
      notes,
      createdAt,
    })
  } catch (err) {
    savedToSanity = false
    console.error('[inquiry] Failed to save inquiry to Sanity:', err)
  }

  const itemsHtml = items
    .map(
      (item) =>
        `<li>${item.name} — ${item.variantLabel} × ${item.quantity} (${formatEur(item.unitPrice * item.quantity)})</li>`,
    )
    .join('')

  const ownerEmailResult = await sendEmail({
    to: INQUIRY_RECIPIENT,
    subject: `[Upit] Novi upit za ponudu — ${orderNumber}`,
    html: `
      <h2>Novi upit za ponudu</h2>
      <p><strong>Broj upita:</strong> ${orderNumber}</p>
      <p><strong>Ime i prezime:</strong> ${customer.fullName}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Telefon:</strong> ${customer.phone ?? '—'}</p>
      <p><strong>Adresa:</strong> ${shippingAddress.address}, ${shippingAddress.postalCode} ${shippingAddress.city}, ${shippingAddress.country}</p>
      <p><strong>Stavke:</strong></p>
      <ul>${itemsHtml}</ul>
      ${notes ? `<p><strong>Napomena:</strong></p><blockquote style="background:#f9f9f9;padding:12px;border-left:4px solid #f59e0b;">${notes}</blockquote>` : ''}
    `,
  })

  // Owner confirmation email is the one channel that must not silently fail —
  // if both the Sanity write and this email failed, the inquiry never reached anyone.
  if (!savedToSanity && !ownerEmailResult.success) {
    console.error('[inquiry] Both Sanity save and owner email failed:', ownerEmailResult.error)
    return NextResponse.json(
      { success: false, error: 'Slanje upita nije uspjelo. Pokušajte ponovno.' },
      { status: 500 },
    )
  }

  // Customer confirmation is best-effort — its failure shouldn't fail the request.
  await sendEmail({
    to: customer.email,
    subject: `Primili smo vaš upit — ${orderNumber}`,
    html: `
      <p>Bok ${customer.fullName},</p>
      <p>Primili smo vaš upit (${orderNumber}). Javit ćemo vam se uskoro s ponudom, konačnom cijenom i načinom plaćanja.</p>
      <p>Hvala!</p>
    `,
  })

  return NextResponse.json({ success: true, orderNumber })
}
