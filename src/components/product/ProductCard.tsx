'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/features/cart/store'
import { useTranslations } from 'next-intl'
import VariantSelectModal from './VariantSelectModal'
import type { Locale, ProductSummary, Variant } from '@/types'

// ─── Sanity CDN image URL helper ─────────────────────────────────────────────
// Builds a Sanity CDN URL from an asset _ref without needing @sanity/image-url.
// Asset _ref format: "image-{id}-{dimensions}-{extension}"

function sanityImageUrl(assetRef: string, width = 400, height = 400): string {
  if (assetRef.startsWith('/')) {
    return assetRef
  }
  const withoutPrefix = assetRef.replace(/^image-/, '')
  const lastDash = withoutPrefix.lastIndexOf('-')
  const ext = withoutPrefix.slice(lastDash + 1)
  const idAndDims = withoutPrefix.slice(0, lastDash)
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${idAndDims}.${ext}?w=${width}&h=${height}&fit=crop&auto=format`
}

// ─── Star rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  rating: number
  reviewCount: number
}

function StarRating({ rating, reviewCount }: StarRatingProps) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Ocjena: ${rating.toFixed(1)} od 5 (${reviewCount} recenzija)`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
          />
        ))}
        {hasHalf && (
          <span className="relative w-3.5 h-3.5">
            <Star className="absolute inset-0 w-3.5 h-3.5 text-amber-400" />
            <span
              className="absolute inset-0 overflow-hidden w-[50%]"
              style={{ width: '50%' }}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
        ))}
      </span>
      <span className="text-xs text-gray-500 font-medium">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  )
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

// Deterministic pastel color from product id
function categoryColor(category: string): string {
  const palette: Record<string, string> = {
    gelovi: '#fde68a',
    napitci: '#a7f3d0',
    proteini: '#ddd6fe',
    default: '#fed7aa',
  }
  const key = Object.keys(palette).find((k) => category.toLowerCase().includes(k))
  return key ? palette[key] : palette.default
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: ProductSummary
  locale?: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductCard({ product, locale = 'hr' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const t = useTranslations('product')
  const tShop = useTranslations('shopMode')

  const [modalOpen, setModalOpen] = useState(false)

  // Localised text with hr fallback
  const name = product.name[locale] ?? product.name.hr
  const shortDesc = product.shortDescription[locale] ?? product.shortDescription.hr

  // Image
  const imageAssetRef = product.mainImage?.asset?._ref
  const imageSrc = imageAssetRef ? sanityImageUrl(imageAssetRef) : null

  const basePrice = product.basePrice

  // Rating
  const hasRating =
    product.averageRating !== undefined &&
    product.reviewCount !== undefined &&
    product.reviewCount > 0

  const defaultVariant = product.variants[0]
  const moq = defaultVariant?.minQuantity ?? product.minQuantity ?? 5

  // Add to cart logic
  const handleAddToCart = useCallback(() => {
    if (product.variants.length > 1) {
      setModalOpen(true)
      return
    }

    // Single variant — add directly
    const variant = product.variants[0]
    if (!variant) return

    const qty = variant.minQuantity ?? product.minQuantity ?? 5

    addItem({
      productId: product._id,
      variantId: variant._key,
      name,
      slug: product.slug,
      imageSrc: imageSrc ?? '',
      variantLabel: [variant.flavour, variant.size].filter(Boolean).join(' / '),
      unitPrice: variant.price ?? basePrice,
      quantity: qty,
    })
    openCart()
  }, [product, name, imageSrc, basePrice, addItem, openCart])

  const handleVariantSelect = useCallback(
    (variant: Variant) => {
      const qty = variant.minQuantity ?? product.minQuantity ?? 5

      addItem({
        productId: product._id,
        variantId: variant._key,
        name,
        slug: product.slug,
        imageSrc: imageSrc ?? '',
        variantLabel: [variant.flavour, variant.size].filter(Boolean).join(' / '),
        unitPrice: variant.price ?? basePrice,
        quantity: qty,
      })
      openCart()
    },
    [product, name, imageSrc, basePrice, addItem, openCart],
  )

  const prefix = locale === 'hr' ? '' : `/${locale}`

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200',
          'transition-shadow duration-200',
          'hover:shadow-lg',
        )}
      >
        {/* Full-card link — click anywhere on the card to open the product.
            Sits above the visuals but below the action buttons (z-20). */}
        <Link
          href={`${prefix}/proizvodi/${product.slug}`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <span className="sr-only">Pogledaj: {name}</span>
        </Link>

        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-b from-amber-50/40 to-gray-50/30 flex items-center justify-center p-5 shrink-0 border-b border-gray-100/60">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              width={400}
              height={400}
              loading="lazy"
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: categoryColor(product.category) }}
            >
              <span className="text-4xl select-none">🍯</span>
            </div>
          )}

          {/* Minimum order badge */}
          <span className="absolute top-3 right-3 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-amber-500/30">
            {tShop('minOrderNotice', { min: moq })}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Name */}
          <h3 className="font-heading font-bold text-base leading-tight text-charcoal line-clamp-2">
            {name}
          </h3>

          {/* Short description */}
          {shortDesc && (
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 flex-1">
              {shortDesc}
            </p>
          )}

          {/* Rating */}
          {hasRating && (
            <StarRating
              rating={product.averageRating!}
              reviewCount={product.reviewCount!}
            />
          )}

          {/* Actions — relative z-20 keeps this above the full-card link overlay */}
          <div className="relative z-20 flex gap-2 mt-auto pt-1">
            <Button
              size="sm"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs gap-1.5"
              onClick={handleAddToCart}
              aria-label={`${t('addToCart')}: ${name}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </article>

      {/* Variant selection modal */}
      {product.variants.length > 1 && (
        <VariantSelectModal
          product={product}
          locale={locale}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleVariantSelect}
        />
      )}
    </>
  )
}
