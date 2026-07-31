'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale, ProductSummary } from '@/types'
import { cn } from '@/lib/utils'
import CatalogueFilters from './CatalogueFilters'
import ProductCard from './ProductCard'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CatalogueGridProps {
  products: ProductSummary[]
  locale?: Locale
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CatalogueGrid({ products, locale = 'hr' }: CatalogueGridProps) {
  const t = useTranslations('filters')
  const [filteredProducts, setFilteredProducts] = useState<ProductSummary[]>(products)
  const [filterKey, setFilterKey] = useState(0)

  const handleFilteredChange = useCallback((filtered: ProductSummary[]) => {
    setFilteredProducts(filtered)
  }, [])

  function handleResetFilters() {
    setFilteredProducts(products)
    setFilterKey((k) => k + 1)
  }

  const isEmpty = filteredProducts.length === 0

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
      {/* Sidebar — filters */}
      <aside className="w-full lg:w-64 lg:shrink-0">
        <CatalogueFilters
          key={filterKey}
          products={products}
          onFilteredChange={handleFilteredChange}
        />
      </aside>

      {/* Main content */}
      <section className="flex-1 min-w-0" aria-label={t('title')}>
        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4" aria-live="polite" aria-atomic="true">
          {isEmpty
            ? t('noResults')
            : t('productsCount', { count: filteredProducts.length })}
        </p>

        {/* Empty state */}
        {isEmpty ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300',
              'bg-gray-50 py-20 px-6 text-center gap-4',
            )}
          >
            <span className="text-5xl select-none" aria-hidden="true">
              🔍
            </span>
            <p className="text-gray-700 font-medium text-lg">{t('noResultsHeading')}</p>
            <p className="text-sm text-gray-500 max-w-xs">
              {t('noResultsSub')}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className={cn(
                'mt-2 inline-flex items-center justify-center rounded-lg',
                'border border-amber-500 text-amber-600 hover:bg-amber-50',
                'px-5 py-2.5 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
              )}
            >
              {t('clear')}
            </button>
          </div>
        ) : (
          /* Product grid */
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            role="list"
            aria-label="Proizvodi"
          >
            {filteredProducts.map((product) => (
              <li key={product._id}>
                <ProductCard product={product} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
