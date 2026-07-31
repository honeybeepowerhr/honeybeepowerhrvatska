import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ClientAddAllButton from './ClientAddAllButton'
import type { Locale, ProductSummary } from '@/types'

// ─── Sanity CDN image URL helper ──────────────────────────────────────────────

function sanityImageUrl(assetRef: string, width = 120, height = 120): string {
  const withoutPrefix = assetRef.replace(/^image-/, '')
  const lastDash = withoutPrefix.lastIndexOf('-')
  const ext = withoutPrefix.slice(lastDash + 1)
  const idAndDims = withoutPrefix.slice(0, lastDash)
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${idAndDims}.${ext}?w=${width}&h=${height}&fit=crop&auto=format`
}

// ─── Price helper ─────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('hr-HR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// ─── Single product tile ──────────────────────────────────────────────────────

interface ProductTileProps {
  product: ProductSummary
  locale: Locale
}

function ProductTile({ product, locale }: ProductTileProps) {
  const name = product.name[locale] ?? product.name.hr
  const price = product.basePrice
  const imageAssetRef = product.mainImage?.asset?._ref
  const imageSrc = imageAssetRef ? sanityImageUrl(imageAssetRef) : null

  return (
    <article
      className="flex flex-col items-center gap-2 text-center min-w-0"
      aria-label={name}
    >
      <Link
        href={`/proizvodi/${product.slug}`}
        className="block rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label={`Pogledaj ${name}`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            width={120}
            height={120}
            loading="lazy"
            className="object-cover w-24 h-24 sm:w-28 sm:h-28"
            sizes="(max-width: 640px) 96px, 112px"
          />
        ) : (
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-amber-50"
            aria-hidden="true"
          >
            <span className="text-3xl select-none">🍯</span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-0.5 px-1">
        <Link
          href={`/proizvodi/${product.slug}`}
          className="text-xs font-semibold text-charcoal leading-snug line-clamp-2 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          {name}
        </Link>
        <span className="text-xs font-bold text-amber-600">
          {formatPrice(price)}&nbsp;€
        </span>
      </div>
    </article>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function Separator() {
  return (
    <div
      className="flex items-center justify-center text-gray-400 shrink-0"
      aria-hidden="true"
    >
      <Plus className="w-4 h-4" />
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FrequentlyBoughtTogetherProps {
  currentProduct: ProductSummary
  /** 1–3 complementary products to show alongside the current one */
  relatedProducts: ProductSummary[]
  locale: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Server Component — prikazuje sekciju "Često se kupuje zajedno".
 * Interaktivni "Dodaj sve u košaricu" gumb delegiran je ClientAddAllButton child componentu.
 */
export default function FrequentlyBoughtTogether({
  currentProduct,
  relatedProducts,
  locale,
}: FrequentlyBoughtTogetherProps) {
  // Show at most 3 complementary products
  const complementary = relatedProducts.slice(0, 3)

  if (complementary.length === 0) return null

  // All products shown (current + complementary) for "add all" action
  const allProducts = [currentProduct, ...complementary]

  // Total price of all shown products (cheapest variant or basePrice)
  const totalCents = allProducts.reduce((sum, p) => {
    const cheapest =
      p.variants.length > 0
        ? Math.min(...p.variants.map((v) => (v.price > 0 ? v.price : p.basePrice)))
        : p.basePrice
    return sum + cheapest
  }, 0)

  return (
    <section
      aria-labelledby="fbt-heading"
      className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 space-y-5"
    >
      <h2
        id="fbt-heading"
        className="font-heading font-bold text-lg text-charcoal"
      >
        Često se kupuje zajedno
      </h2>

      {/* Product tiles with + separators */}
      <div
        className="flex flex-wrap items-start gap-3 sm:gap-4"
        role="list"
        aria-label="Proizvodi koji se često kupuju zajedno"
      >
        {allProducts.map((product, index) => (
          <div
            key={product._id}
            className="flex items-center gap-3 sm:gap-4"
            role="listitem"
          >
            <ProductTile product={product} locale={locale} />
            {index < allProducts.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Summary + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Ukupno:{' '}
          <span className="font-bold text-charcoal text-base">
            {formatPrice(totalCents)}&nbsp;€
          </span>
        </p>

        {/* Client component handles the cart interaction */}
        <ClientAddAllButton products={allProducts} locale={locale} />
      </div>
    </section>
  )
}
