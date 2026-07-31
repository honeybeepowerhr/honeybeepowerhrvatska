'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Building2, ShoppingBag } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/features/cart/store'
import { translateFlavour } from '@/lib/utils'
import type { Locale, ProductSummary, Variant } from '@/types'

interface ProductAddToCartButtonProps {
  product: ProductSummary
  variant: Variant
}

export default function ProductAddToCartButton({ product, variant }: ProductAddToCartButtonProps) {
  const { addItem, openCart, shopMode } = useCartStore()
  const t = useTranslations('product')
  const tShop = useTranslations('shopMode')
  const locale = (useLocale() as Locale) || 'hr'

  const prodName = product.name[locale] ?? product.name.hr
  const moq = variant.minQuantity ?? product.minQuantity ?? 5
  const initialQty = shopMode === 'wholesale' ? moq : 1

  const [quantity, setQuantity] = useState(initialQty)

  // Update quantity whenever shopMode or variant changes
  useEffect(() => {
    setQuantity(shopMode === 'wholesale' ? moq : 1)
  }, [shopMode, moq])

  const step = shopMode === 'wholesale' ? (moq >= 100 ? 50 : 5) : 1

  const handleDecrease = () => {
    const min = shopMode === 'wholesale' ? moq : 1
    if (quantity > min) {
      setQuantity((prev) => Math.max(min, prev - step))
    }
  }

  const handleIncrease = () => {
    setQuantity((prev) => prev + step)
  }

  const handleAdd = () => {
    addItem({
      productId: product._id,
      variantId: variant._key,
      name: prodName,
      slug: product.slug,
      imageSrc: product.mainImage.asset._ref,
      variantLabel: `${translateFlavour(variant.flavour, locale)} (${variant.size})`,
      unitPrice: variant.price,
      quantity,
    })
    openCart()
  }

  return (
    <div className="space-y-4">
      {/* Mode info badge */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-950 flex items-center gap-2">
        {shopMode === 'wholesale' ? (
          <>
            <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {tShop('wholesaleBadge')} &bull; <strong>{tShop('minOrderNotice', { min: moq })}</strong>
            </span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{tShop('retailSurchargeNotice')}</span>
          </>
        )}
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Quantity selector */}
        <div className="flex items-center justify-between border border-gray-200 rounded-2xl bg-gray-50/80 px-3 py-1.5 min-w-[140px]">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={shopMode === 'wholesale' ? quantity <= moq : quantity <= 1}
            className="p-1 text-gray-600 hover:text-amber-600 disabled:opacity-40 disabled:hover:text-gray-600 transition-colors"
            aria-label="Smanji količinu"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-heading font-extrabold text-base text-gray-900 px-4">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="p-1 text-gray-600 hover:text-amber-600 transition-colors"
            aria-label="Povećaj količinu"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add button */}
        <Button
          onClick={handleAdd}
          size="lg"
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 h-13 rounded-2xl text-base shadow-lg transition-transform active:scale-98"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t('addToCart')}
        </Button>
      </div>
    </div>
  )
}
