import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Star, Check, ArrowLeft } from 'lucide-react'
import { REAL_PRODUCTS } from '@/lib/products-data'
import type { Locale } from '@/types'
import ProductAddToCartButton from './ProductAddToCartButton'
import ProductImageGallery from './ProductImageGallery'

export const revalidate = 60

const KNOWN_CATEGORIES: Record<string, Record<Locale, string>> = {
  'energetski-gelovi': {
    hr: 'Energetski Gelovi',
    en: 'Energy Gels',
    de: 'Energie-Gels',
    sl: 'Energetski geli',
    pl: 'Żele energetyczne',
  },
  'izotonicki-napitci': {
    hr: 'Izotonični Napitci',
    en: 'Isotonic Drinks',
    de: 'Isotonische Getränke',
    sl: 'Izotonični napitki',
    pl: 'Napoje izotoniczne',
  },
}

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const categorySlugs = Object.keys(KNOWN_CATEGORIES).map((slug) => ({ slug }))
  const productSlugs = REAL_PRODUCTS.map((p) => ({ slug: p.slug }))
  return [...categorySlugs, ...productSlugs]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const currentLocale = locale || 'hr'

  if (KNOWN_CATEGORIES[slug]) {
    const catName = KNOWN_CATEGORIES[slug][currentLocale] ?? KNOWN_CATEGORIES[slug].hr
    return {
      title: `${catName} | Honey Bee Power`,
      description: `${catName} — 100% natural honey-based sports nutrition.`,
    }
  }

  const product = REAL_PRODUCTS.find((p) => p.slug === slug)
  if (product) {
    const prodName = product.name[currentLocale] ?? product.name.hr
    const prodDesc = product.shortDescription[currentLocale] ?? product.shortDescription.hr
    return {
      title: `${prodName} | Honey Bee Power`,
      description: prodDesc,
    }
  }

  return {
    title: 'Proizvodi | Honey Bee Power',
    description: 'Honey Bee Power — natural honey-based sports nutrition.',
  }
}

export default async function ProductOrCategoryPage({ params }: PageProps) {
  const { locale, slug } = await params
  const currentLocale: Locale = locale || 'hr'
  const prefix = currentLocale === 'hr' ? '' : `/${currentLocale}`

  // Labels dictionary
  const LABELS = {
    backToAll: {
      hr: 'Natrag na sve proizvode',
      en: 'Back to all products',
      de: 'Zurück zu allen Produkten',
      sl: 'Nazaj na vse izdelke',
      pl: 'Wróć do wszystkich produktów',
    },
    allProducts: {
      hr: 'Svi proizvodi',
      en: 'All products',
      de: 'Alle Produkte',
      sl: 'Vsi izdelki',
      pl: 'Wszystkie produkty',
    },
    details: {
      hr: 'Detalji',
      en: 'Details',
      de: 'Details',
      sl: 'Podrobnosti',
      pl: 'Szczegóły',
    },
    reviews: {
      hr: 'recenzija',
      en: 'reviews',
      de: 'Bewertungen',
      sl: 'ocen',
      pl: 'recenzji',
    },
    feature1: {
      hr: '100% Prirodni cvjetni med',
      en: '100% Natural flower honey',
      de: '100% Natürlicher Blütenhonig',
      sl: '100% Naravni cvetlični med',
      pl: '100% Naturalny miód kwiatowy',
    },
    feature2: {
      hr: 'Bez sukraloze & bez sintetičkih boja',
      en: 'No sucralose & no synthetic colors',
      de: 'Ohne Sucralose & ohne synthetische Farbstoffe',
      sl: 'Brez sukraloze in sintetičnih barvil',
      pl: 'Bez sukralozy i syntetycznych barwników',
    },
    feature3: {
      hr: 'Prirodni elektroliti i liofilizirano voće',
      en: 'Natural electrolytes & freeze-dried fruit',
      de: 'Natürliche Elektrolyte & gefriergetrocknete Früchte',
      sl: 'Naravni elektroliti in zmrzovalno posušeno sadje',
      pl: 'Naturalne elektrolity i owoce liofilizowane',
    },
    gelBadge: {
      hr: 'Energetski Gel',
      en: 'Energy Gel',
      de: 'Energie-Gel',
      sl: 'Energetski gel',
      pl: 'Żel energetyczny',
    },
    isoBadge: {
      hr: 'Izotonični Napitak',
      en: 'Isotonic Drink',
      de: 'Isotonisches Getränk',
      sl: 'Izotonični napitek',
      pl: 'Napój izotoniczny',
    },
  }

  // 1. If it's a category page
  if (KNOWN_CATEGORIES[slug]) {
    const categoryName = KNOWN_CATEGORIES[slug][currentLocale] ?? KNOWN_CATEGORIES[slug].hr
    const categoryProducts = REAL_PRODUCTS.filter((p) => p.category === slug)

    return (
      <div className="py-12 bg-white relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href={`${prefix}/proizvodi`} className="inline-flex items-center text-sm font-bold text-amber-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> {LABELS.backToAll[currentLocale]}
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2 font-heading">{categoryName}</h1>
          <p className="text-gray-600 mb-8 font-sans font-medium">Honey Bee Power — {categoryName}.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((prod) => {
              const prodName = prod.name[currentLocale] ?? prod.name.hr
              const prodDesc = prod.shortDescription[currentLocale] ?? prod.shortDescription.hr

              return (
                <div key={prod._id} className="relative bg-white rounded-3xl border border-amber-200 p-5 shadow-sm hover:shadow-xl transition-all">
                  <Link
                    href={`${prefix}/proizvodi/${prod.slug}`}
                    className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <span className="sr-only">Pogledaj: {prodName}</span>
                  </Link>
                  <div className="relative aspect-square mb-4 bg-amber-50 rounded-2xl overflow-hidden">
                    <Image src={prod.mainImage.asset._ref} alt={prodName} fill className="object-contain p-4" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">{prodName}</h3>
                  <p className="text-sm text-gray-600 mb-4">{prodDesc}</p>
                  <div className="flex items-center justify-end font-extrabold text-lg text-gray-900">
                    <span className="relative z-20 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs uppercase font-extrabold">
                      {LABELS.details[currentLocale]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 2. Find product
  const product = REAL_PRODUCTS.find((p) => p.slug === slug)
  if (!product) {
    notFound()
  }

  const prodName = product.name[currentLocale] ?? product.name.hr
  const prodDesc = product.shortDescription[currentLocale] ?? product.shortDescription.hr
  const variant = product.variants[0]

  return (
    <div className="py-12 bg-white relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href={`${prefix}/proizvodi`} className="inline-flex items-center text-sm font-bold text-amber-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> {LABELS.allProducts[currentLocale]}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-amber-200 shadow-xl">
          {/* Image gallery */}
          <ProductImageGallery
            images={
              product.imageGallery && product.imageGallery.length > 0
                ? product.imageGallery.map((img) => ({
                    src: img.asset._ref,
                    alt: img.alt || prodName,
                  }))
                : [{ src: product.mainImage.asset._ref, alt: prodName }]
            }
          />

          {/* Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              {product.category === 'energetski-gelovi'
                ? LABELS.gelBadge[currentLocale]
                : LABELS.isoBadge[currentLocale]}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-heading leading-tight">
              {prodName}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {product.averageRating} ({product.reviewCount} {LABELS.reviews[currentLocale]})
              </span>
            </div>

            <p className="text-base text-gray-700 font-sans leading-relaxed">
              {prodDesc}
            </p>

            <div className="space-y-2 pt-2 border-t border-amber-100 text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{LABELS.feature1[currentLocale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{LABELS.feature2[currentLocale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{LABELS.feature3[currentLocale]}</span>
              </div>
            </div>

            <div className="pt-4">
              <ProductAddToCartButton product={product} variant={variant} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
