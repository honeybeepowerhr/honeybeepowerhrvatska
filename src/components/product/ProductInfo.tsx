'use client'

import { useState, useCallback } from 'react'
import { Star, ShieldCheck, Truck, RefreshCcw, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/features/cart/store'
import VariantSwitcher from './VariantSwitcher'
import QuantityInput from './QuantityInput'
import type { ProductFull, Locale, Variant } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

/** Price-per-gram for gel/energy products — shown when size ends with 'g' */
function pricePerGram(cents: number, size: string): string | null {
  const match = /^(\d+(?:\.\d+)?)\s*g$/i.exec(size.trim())
  if (!match) return null
  const grams = parseFloat(match[1])
  if (!grams) return null
  return (cents / 100 / grams).toFixed(2)
}

/** Resolve the effective price for a variant: variant.price overrides basePrice */
function effectivePrice(variant: Variant, basePrice: number): number {
  return variant.price > 0 ? variant.price : basePrice
}

// ─── Star rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  rating: number   // 0–5
  count: number
}

function StarRating({ rating, count }: StarRatingProps) {
  const full = Math.floor(rating)
  const partial = rating - full

  return (
    <div className="flex items-center gap-1.5" aria-label={`Ocjena ${rating.toFixed(1)} od 5, ${count} recenzija`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) {
            return (
              <Star
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            )
          }
          if (i === full && partial >= 0.25) {
            return (
              <span key={i} className="relative inline-flex w-4 h-4">
                <Star className="absolute inset-0 w-4 h-4 text-gray-300" aria-hidden="true" />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${partial * 100}%` }}
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                </span>
              </span>
            )
          }
          return (
            <Star key={i} className="w-4 h-4 text-gray-300" aria-hidden="true" />
          )
        })}
      </span>
      <span className="text-sm text-gray-500">
        <span className="font-semibold text-charcoal">{rating.toFixed(1)}</span>
        {' '}({count} {count === 1 ? 'recenzija' : count < 5 ? 'recenzije' : 'recenzija'})
      </span>
    </div>
  )
}

// ─── Trust signals ────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: Package,    label: 'Na zalihi' },
  { icon: Truck,      label: 'Dostava 1-2 dana' },
  { icon: ShieldCheck,label: 'Sigurno plaćanje' },
  { icon: RefreshCcw, label: 'Povrat 14 dana' },
] as const

function TrustBar() {
  return (
    <ul
      className="flex flex-wrap gap-x-4 gap-y-2"
      role="list"
      aria-label="Informacije o kupnji"
    >
      {TRUST_ITEMS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <Icon className="w-3.5 h-3.5 text-green-nature shrink-0" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductInfoProps {
  product: ProductFull
  locale: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductInfo({ product, locale }: ProductInfoProps) {
  // ── Initialise with first in-stock variant, or first overall ───────────────
  const firstVariant =
    product.variants.find((v) => v.stockLevel > 0) ?? product.variants[0]

  const [selectedVariantKey, setSelectedVariantKey] = useState<string>(
    firstVariant?._key ?? '',
  )
  const [quantity, setQuantity] = useState<number>(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)

  // ── Derived from selection ─────────────────────────────────────────────────
  const selectedVariant: Variant | undefined = product.variants.find(
    (v) => v._key === selectedVariantKey,
  )

  const price = selectedVariant
    ? effectivePrice(selectedVariant, product.basePrice)
    : product.basePrice

  const compareAt =
    selectedVariant?.compareAtPrice !== undefined
      ? selectedVariant.compareAtPrice
      : product.compareAtPrice

  const showCompareAt =
    compareAt !== null && compareAt !== undefined && compareAt > price

  const ppg = selectedVariant ? pricePerGram(price, selectedVariant.size) : null

  const isOutOfStock = selectedVariant ? selectedVariant.stockLevel === 0 : false

  // ── Localised name ────────────────────────────────────────────────────────
  const productName = product.name[locale] ?? product.name.hr

  // ── Variant change ────────────────────────────────────────────────────────
  const handleVariantSelect = useCallback((variantId: string) => {
    setSelectedVariantKey(variantId)
    setQuantity(1)
    setAdded(false)
  }, [])

  // ── Add to cart ───────────────────────────────────────────────────────────
  function handleAddToCart() {
    if (!selectedVariant || isOutOfStock) return

    const variantLabel = `${selectedVariant.flavour} / ${selectedVariant.size}`
    const imageSrc =
      (selectedVariant.imageOverride?.asset._ref) ??
      product.mainImage.asset._ref ??
      ''

    addItem({
      productId: product._id,
      variantId: selectedVariant._key,
      name: productName,
      slug: product.slug,
      imageSrc,
      variantLabel,
      unitPrice: price,
      quantity,
    })

    setAdded(true)
    // Reset visual feedback after 2s
    setTimeout(() => setAdded(false), 2000)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      {/* ── Product name (sole H1 on the page) ──────────────────────────── */}
      <h1 className="font-heading font-black text-4xl sm:text-5xl text-charcoal leading-tight">
        {productName}
      </h1>

      {/* ── Rating ──────────────────────────────────────────────────────── */}
      {product.reviewCount != null &&
        product.reviewCount > 0 &&
        product.averageRating != null && (
          <StarRating
            rating={product.averageRating}
            count={product.reviewCount}
          />
        )}

      {/* ── Price block ─────────────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3 flex-wrap">
        {/* Current price */}
        <span
          className="text-3xl font-black text-charcoal"
          aria-label={`Cijena ${formatPrice(price)} eura s PDV-om`}
        >
          {formatPrice(price)}&nbsp;€
        </span>

        {/* Crossed-out compare-at price */}
        {showCompareAt && (
          <span
            className="text-lg text-gray-400 line-through"
            aria-label={`Stara cijena ${formatPrice(compareAt!)} eura`}
          >
            {formatPrice(compareAt!)}&nbsp;€
          </span>
        )}

        {/* Discount badge */}
        {showCompareAt && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700"
            aria-hidden="true"
          >
            -
            {Math.round(
              ((compareAt! - price) / compareAt!) * 100,
            )}
            %
          </span>
        )}
      </div>

      {/* Price per gram */}
      {ppg && (
        <p className="text-sm text-gray-500 -mt-3">
          {ppg}&nbsp;€/g
        </p>
      )}

      {/* VAT note */}
      <p className="text-xs text-gray-400 -mt-4">
        Cijena uključuje PDV
      </p>

      {/* ── Variant switcher ─────────────────────────────────────────────── */}
      {product.variants.length > 0 && (
        <VariantSwitcher
          variants={product.variants}
          selectedVariantId={selectedVariantKey}
          onSelect={handleVariantSelect}
        />
      )}

      {/* ── Quantity + Add to cart ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <QuantityInput
          value={quantity}
          min={1}
          max={Math.min(99, selectedVariant?.stockLevel ?? 99)}
          onChange={setQuantity}
        />

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          aria-live="polite"
          className={cn(
            'flex-1 min-w-[180px] h-12 rounded-xl font-bold text-base transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : added
              ? 'bg-green-nature text-white scale-[0.98]'
              : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white',
          )}
        >
          {isOutOfStock
            ? 'Nije na zalihi'
            : added
            ? '✓ Dodano u košaricu'
            : 'Dodaj u košaricu'}
        </button>
      </div>

      {/* ── Bulk discount ────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm font-medium text-amber-800"
        role="note"
        aria-label="Akcija za kupnju na veliko"
      >
        🍯 <span>Kupi 10, uštedi 15%</span>
      </div>

      {/* ── Trust signals ────────────────────────────────────────────────── */}
      <TrustBar />
    </div>
  )
}
