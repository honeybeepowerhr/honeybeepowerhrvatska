import { type NextRequest, NextResponse } from 'next/server'
import { sanityServerClient } from '@/lib/sanity/client'

interface ReviewRequestBody {
  productId: string
  rating: number
  title: string
  body: string
  author: string
}

function isReviewRequestBody(value: unknown): value is ReviewRequestBody {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.productId === 'string' &&
    typeof obj.rating === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string' &&
    typeof obj.author === 'string'
  )
}

/**
 * POST /api/reviews
 *
 * Creates a new product review document in Sanity with status 'pending'.
 * Reviews require admin approval before becoming public.
 *
 * Body: { productId, rating, title, body, author }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let rawBody: unknown

  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Neispravan JSON u tijelu zahtjeva.' },
      { status: 400 },
    )
  }

  if (!isReviewRequestBody(rawBody)) {
    return NextResponse.json(
      { success: false, error: 'Nedostaju obavezna polja: productId, rating, title, body, author.' },
      { status: 400 },
    )
  }

  const { productId, rating, title, body, author } = rawBody

  // --- Validation ---

  if (!productId.trim()) {
    return NextResponse.json(
      { success: false, error: 'productId ne smije biti prazan.' },
      { status: 400 },
    )
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, error: 'Ocjena mora biti cijeli broj između 1 i 5.' },
      { status: 400 },
    )
  }

  if (title.trim().length < 3) {
    return NextResponse.json(
      { success: false, error: 'Naslov mora imati najmanje 3 znaka.' },
      { status: 400 },
    )
  }

  if (body.trim().length < 10) {
    return NextResponse.json(
      { success: false, error: 'Tekst recenzije mora imati najmanje 10 znakova.' },
      { status: 400 },
    )
  }

  if (author.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Ime autora mora imati najmanje 2 znaka.' },
      { status: 400 },
    )
  }

  // --- Development mode: no Sanity token configured ---

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      {
        success: true,
        message: 'Recenzija je zaprimljena i čeka odobrenje (development mode)',
      },
      { status: 200 },
    )
  }

  // --- Create review document in Sanity ---

  try {
    await sanityServerClient.create({
      _type: 'review',
      productId: productId.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      author: author.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/reviews] Sanity create error:', error)
    return NextResponse.json(
      { success: false, error: 'Greška pri pohrani recenzije. Pokušajte ponovo.' },
      { status: 500 },
    )
  }
}
