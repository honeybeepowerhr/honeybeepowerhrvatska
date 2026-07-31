'use client'

import { useCallback, useState } from 'react'
import { ShoppingBasket, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/features/cart/store'
import type { Locale, ProductSummary } from '@/types'

// ─── Sanity CDN image URL helper ──────────────────────────────────────────────

function sanityImageUrl(assetRef: string, width = 200): string {
  const withoutPrefix = assetRef.replace(/^image-/, '')
  const lastDash = withoutPrefix.lastIndexOf('-')
  const ext = withoutPrefix.slice(lastDash + 1)
  const idAndDims = withoutPrefix.slice(0, lastDash)
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${idAndDims}.${ext}?w=${width}&auto=format`
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ClientAddAllButtonProps {
  /** All products to add (current + complementary), max 4 */
  products: ProductSummary[]
  locale: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientAddAllButton({ products, locale }: ClientAddAllButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [added, setAdded] = useState(false)

  const handleAddAll = useCallback(() => {
    for (const product of products) {
      // Pick first available variant, or fall back to first variant
      const variant =
        product.variants.find((v) => v.stockLevel > 0) ?? product.variants[0]
      if (!variant) continue

      const name = product.name[locale] ?? product.name.hr
      const imageAssetRef = product.mainImage?.asset?._ref
      const imageSrc = imageAssetRef ? sanityImageUrl(imageAssetRef) : ''

      addItem({
        productId: product._id,
        variantId: variant._key,
        name,
        slug: product.slug,
        imageSrc,
        variantLabel: [variant.flavour, variant.size].filter(Boolean).join(' / '),
        unitPrice: variant.price > 0 ? variant.price : product.basePrice,
        quantity: 1,
      })
    }

    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }, [products, locale, addItem, openCart])

  return (
    <Button
      type="button"
      onClick={handleAddAll}
      disabled={added}
      aria-label="Dodaj sve prikazane proizvode u košaricu"
      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all disabled:opacity-80 disabled:cursor-default"
    >
      {added ? (
        <>
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          Dodano u košaricu
        </>
      ) : (
        <>
          <ShoppingBasket className="w-4 h-4 shrink-0" aria-hidden="true" />
          Dodaj sve u košaricu
        </>
      )}
    </Button>
  )
}
