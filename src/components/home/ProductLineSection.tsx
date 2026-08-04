'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Star, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/features/cart/store'
import { Button } from '@/components/ui/button'
import { REAL_PRODUCTS } from '@/lib/products-data'
import type { Locale } from '@/types'

export function ProductLineSection() {
  const { addItem, openCart } = useCartStore()
  const t = useTranslations('productOffer')
  const locale = (useLocale() as Locale) || 'hr'
  const prefix = locale === 'hr' ? '' : `/${locale}`

  return (
    <section className="py-16 md:py-24 bg-white border-b border-amber-100 relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider mb-3">
              {t('badge')}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 font-heading">
              {t('title')}
            </h2>
            <p className="text-gray-600 mt-2 text-base sm:text-lg max-w-2xl font-sans font-medium">
              {t('subtitle')}
            </p>
          </div>

          <Link
            href={`${prefix}/proizvodi`}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-extrabold text-base mt-4 md:mt-0 transition-colors"
          >
            {t('viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* 5 Real Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {REAL_PRODUCTS.map((prod) => {
            const variant = prod.variants[0]

            const prodName = prod.name[locale] ?? prod.name.hr
            const prodShortDesc = prod.shortDescription[locale] ?? prod.shortDescription.hr

            const handleAddToCart = () => {
              addItem({
                productId: prod._id,
                variantId: variant._key,
                name: prodName,
                slug: prod.slug,
                imageSrc: prod.mainImage.asset._ref,
                variantLabel: `${variant.flavour} (${variant.size})`,
                unitPrice: variant.price,
                quantity: 1,
              })
              openCart()
            }

            return (
              <div
                key={prod._id}
                className="group relative bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Full-card link — click anywhere to open the product. Sits
                    above the visuals but below the "Dodaj" button (z-20). */}
                <Link
                  href={`${prefix}/proizvodi/${prod.slug}`}
                  className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span className="sr-only">Pogledaj: {prodName}</span>
                </Link>

                <div>
                  <div className="relative aspect-square mb-5 overflow-hidden rounded-2xl bg-amber-50">
                    <Image
                      src={prod.mainImage.asset._ref}
                      alt={prodName}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-amber-600 font-bold mb-2">
                    <span className="uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200">
                      {prod.category === 'energetski-gelovi' ? t('gelBadge') : t('isoBadge')}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{prod.averageRating} ({prod.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors font-heading">
                    {prodName}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-sans">
                    {prodShortDesc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-amber-100 flex items-center justify-end">
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="relative z-20 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl px-4 shadow-md transition-transform active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    {t('addToCart')}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
