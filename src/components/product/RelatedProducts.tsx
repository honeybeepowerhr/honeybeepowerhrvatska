import ProductCard from './ProductCard'
import type { Locale, ProductSummary } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface RelatedProductsProps {
  products: ProductSummary[]
  locale: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Server Component — prikazuje grid povezanih proizvoda.
 * Renderira null ako nema produkata.
 */
export default function RelatedProducts({ products, locale }: RelatedProductsProps) {
  if (products.length === 0) return null

  // Limit to 4 products to keep the grid clean
  const displayed = products.slice(0, 4)

  return (
    <section aria-labelledby="related-products-heading" className="space-y-5">
      <h2
        id="related-products-heading"
        className="font-heading font-bold text-xl sm:text-2xl text-charcoal"
      >
        Povezani proizvodi
      </h2>

      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="list"
        aria-label="Popis povezanih proizvoda"
      >
        {displayed.map((product) => (
          <li key={product._id} role="listitem">
            <ProductCard product={product} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}
