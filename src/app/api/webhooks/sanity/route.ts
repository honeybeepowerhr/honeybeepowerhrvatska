import { type NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/webhooks/sanity
 *
 * Sanity CMS Webhook for ISR On-Demand Revalidation.
 * Revalidates relevant pages when products, categories or blog posts are updated in Sanity Studio.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { _type, slug } = body ?? {}

    console.log(`[Sanity Webhook] Revalidating type: ${_type}, slug: ${slug?.current}`)

    // Revalidate home page and catalogue
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/[locale]/proizvodi', 'page')

    if (_type === 'product' && slug?.current) {
      revalidatePath(`/[locale]/proizvodi/${slug.current}`, 'page')
    }

    if (_type === 'blogPost' && slug?.current) {
      revalidatePath(`/[locale]/vodici/${slug.current}`, 'page')
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      now: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Revalidation error' },
      { status: 500 },
    )
  }
}
