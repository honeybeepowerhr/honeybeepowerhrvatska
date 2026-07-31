import type { FAQ, Locale, ProductFull } from '@/types'

// ---------------------------------------------------------------------------
// Product schema
// ---------------------------------------------------------------------------

/**
 * Builds a schema.org Product JSON-LD object for a given product and locale.
 *
 * Prices are stored as integer cents; the schema emits decimal EUR values.
 */
export function buildProductSchema(
  product: ProductFull,
  locale: Locale,
  siteUrl: string,
): Record<string, unknown> {
  const firstVariant = product.variants[0]
  const priceInEur = (firstVariant?.price ?? product.basePrice) / 100

  const availability =
    (firstVariant?.stockLevel ?? 0) > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'

  const productUrl = `${siteUrl}/${locale}/products/${product.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale] ?? product.name.hr,
    description:
      product.shortDescription[locale] ?? product.shortDescription.hr,
    brand: {
      '@type': 'Brand',
      name: 'Honey Bee Power',
    },
    offers: {
      '@type': 'Offer',
      price: priceInEur.toFixed(2),
      priceCurrency: 'EUR',
      availability,
      url: productUrl,
    },
  }

  // SKU from first variant
  if (firstVariant?.sku) {
    schema.sku = firstVariant.sku
  }

  // First image from gallery, fallback to mainImage
  const firstImage = product.imageGallery?.[0] ?? product.mainImage
  if (firstImage?.asset?._ref) {
    // Sanity image URL requires the asset ref to be resolved externally;
    // store the ref as a placeholder — callers may pass a pre-resolved URL.
    schema.image = firstImage.asset._ref
  }

  // Aggregate rating — only when there are reviews
  if (
    typeof product.reviewCount === 'number' &&
    product.reviewCount > 0 &&
    typeof product.averageRating === 'number'
  ) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating.toFixed(1),
      reviewCount: product.reviewCount,
    }
  }

  return schema
}

// ---------------------------------------------------------------------------
// FAQPage schema
// ---------------------------------------------------------------------------

/**
 * Builds a schema.org FAQPage JSON-LD object from an array of FAQ entries.
 */
export function buildFAQPageSchema(
  faq: FAQ[],
  locale: Locale,
): Record<string, unknown> {
  const mainEntity = faq.map((item) => ({
    '@type': 'Question',
    name: item.question[locale] ?? item.question.hr,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer[locale] ?? item.answer.hr,
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }
}

// ---------------------------------------------------------------------------
// BreadcrumbList schema
// ---------------------------------------------------------------------------

/**
 * Builds a schema.org BreadcrumbList JSON-LD object from an ordered list of
 * breadcrumb items.
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

// ---------------------------------------------------------------------------
// Organization schema
// ---------------------------------------------------------------------------

/**
 * Builds a schema.org Organization JSON-LD object for Planet Bio d.o.o.
 */
export function buildOrganizationSchema(
  siteUrl: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Planet Bio d.o.o.',
    url: siteUrl,
    brand: {
      '@type': 'Brand',
      name: 'Honey Bee Power',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'HR',
    },
    sameAs: [
      'https://www.instagram.com/planet__bio/',
    ],
  }
}
