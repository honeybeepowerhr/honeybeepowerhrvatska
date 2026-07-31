import { groq } from 'next-sanity'
import type { ProductFull, ProductSummary, BlogPostSummary, Athlete, Retailer, Testimonial } from '@/types'
import { sanityClient } from './client'

// ---------------------------------------------------------------------------
// Product queries
// ---------------------------------------------------------------------------

/** Projection shared by both listing and full product queries. */
const productSummaryProjection = groq`
  _id,
  "name": name,
  "slug": slug.current,
  "category": category->slug.current,
  "shortDescription": shortDescription,
  basePrice,
  compareAtPrice,
  "mainImage": imageGallery[0],
  variants[]{
    _key,
    flavour,
    size,
    sku,
    gtin,
    price,
    compareAtPrice,
    stockLevel,
    imageOverride
  },
  eligibleForSubscription,
  isBundleItem
`

/**
 * Fetch all active products for catalogue listing.
 * Results are ordered by category then name.
 */
export const getProducts = groq`
  *[_type == "product" && status == "active"] | order(category->slug.current asc, name.hr asc) {
    ${productSummaryProjection}
  }
`

/**
 * Catalogue listing query — dohvaća sve aktivne proizvode s poljima potrebnim za ProductCard.
 * Alias koji zadovoljava task 5.1 naming konvenciju.
 */
export const allProductsQuery = groq`
  *[_type == "product" && status == "active"] | order(category->slug.current asc, name.hr asc) {
    _id,
    "name": name,
    "slug": slug.current,
    "category": category->slug.current,
    "shortDescription": shortDescription,
    basePrice,
    compareAtPrice,
    "imageGallery": [imageGallery[0]],
    variants[]{
      _key,
      flavour,
      size,
      price,
      stockLevel,
      sku
    },
    averageRating,
    reviewCount
  }
`

/**
 * Fetch active products filtered by category slug.
 */
export const getProductsByCategory = groq`
  *[_type == "product" && status == "active" && category->slug.current == $category] | order(name.hr asc) {
    ${productSummaryProjection}
  }
`

/**
 * Catalogue listing query filtrirana po category slug-u.
 * Alias koji zadovoljava task 5.1 naming konvenciju.
 */
export const productsByCategoryQuery = groq`
  *[_type == "product" && status == "active" && category->slug.current == $category] | order(name.hr asc) {
    _id,
    "name": name,
    "slug": slug.current,
    "category": category->slug.current,
    "shortDescription": shortDescription,
    basePrice,
    compareAtPrice,
    "imageGallery": [imageGallery[0]],
    variants[]{
      _key,
      flavour,
      size,
      price,
      stockLevel,
      sku
    },
    averageRating,
    reviewCount
  }
`

/**
 * Fetch a single product by slug (full data for the product page).
 */
export const getProduct = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productSummaryProjection},
    fullDescription,
    "imageGallery": imageGallery[]{
      _type,
      asset,
      alt,
      hotspot
    },
    nutritionalValues,
    ingredients,
    allergens,
    faq[]{
      _key,
      question,
      answer
    },
    status,
    seoTitle,
    seoDescription
  }
`

/**
 * Fetch all active product slugs for generateStaticParams.
 */
export const getAllProductSlugs = groq`
  *[_type == "product" && status == "active"].slug.current
`

/**
 * Fetch 3–4 related products in the same category (excluding current).
 */
export const getRelatedProducts = groq`
  *[_type == "product" && status == "active" && category->slug.current == $category && slug.current != $slug] | order(_createdAt desc) [0...4] {
    ${productSummaryProjection}
  }
`

// ---------------------------------------------------------------------------
// Category queries
// ---------------------------------------------------------------------------

export const getCategories = groq`
  *[_type == "category"] | order(name.hr asc) {
    _id,
    "name": name,
    "slug": slug.current,
    description
  }
`

// ---------------------------------------------------------------------------
// Blog / Vodič queries
// ---------------------------------------------------------------------------

/**
 * Fetch blog post list for the /vodici listing page.
 */
export const getBlogPosts = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    "title": title,
    "slug": slug.current,
    publishedAt,
    category,
    featuredImage,
    seoTitle,
    seoDescription
  }
`

/**
 * Fetch a single blog post by slug.
 */
export const getBlogPost = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    "title": title,
    "slug": slug.current,
    publishedAt,
    category,
    featuredImage,
    body,
    seoTitle,
    seoDescription,
    author-> {
      name,
      photo
    }
  }
`

/**
 * Fetch all blog post slugs for generateStaticParams.
 */
export const getAllBlogSlugs = groq`
  *[_type == "blogPost"].slug.current
`

// ---------------------------------------------------------------------------
// Athlete queries
// ---------------------------------------------------------------------------

export const getAthletes = groq`
  *[_type == "athlete"] | order(name asc) {
    _id,
    name,
    photo,
    sport,
    discipline,
    keyResults,
    biography,
    quote
  }
`

// ---------------------------------------------------------------------------
// Retailer queries
// ---------------------------------------------------------------------------

export const getRetailers = groq`
  *[_type == "retailer"] | order(city asc) {
    _id,
    name,
    address,
    city,
    coordinates,
    type,
    logo
  }
`

// ---------------------------------------------------------------------------
// Testimonial queries
// ---------------------------------------------------------------------------

export const getTestimonials = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name,
    photo,
    sport,
    achievement,
    quote,
    rating
  }
`

// ---------------------------------------------------------------------------
// Bundle queries
// ---------------------------------------------------------------------------

export const getBundles = groq`
  *[_type == "bundle"] | order(name.hr asc) {
    _id,
    "name": name,
    "slug": slug.current,
    "products": products[]{
      "product": product->{
        _id,
        "slug": slug.current,
        "name": name,
        basePrice,
        "mainImage": imageGallery[0]
      },
      "variant": variant->{
        _key,
        flavour,
        size,
        sku,
        price
      },
      quantity
    },
    bundlePrice,
    imageGallery,
    description
  }
`

// ---------------------------------------------------------------------------
// Helper fetch functions
// ---------------------------------------------------------------------------

export async function fetchProducts(): Promise<ProductSummary[]> {
  return sanityClient.fetch(getProducts)
}

export async function fetchProductsByCategory(category: string): Promise<ProductSummary[]> {
  return sanityClient.fetch(getProductsByCategory, { category })
}

export async function fetchProduct(slug: string): Promise<ProductFull | null> {
  return sanityClient.fetch(getProduct, { slug })
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  return sanityClient.fetch(getAllProductSlugs)
}

export async function fetchRelatedProducts(category: string, slug: string): Promise<ProductSummary[]> {
  return sanityClient.fetch(getRelatedProducts, { category, slug })
}

export async function fetchBlogPosts(): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(getBlogPosts)
}

export async function fetchBlogPost(slug: string): Promise<BlogPostSummary | null> {
  return sanityClient.fetch(getBlogPost, { slug })
}

export async function fetchAllBlogSlugs(): Promise<string[]> {
  return sanityClient.fetch(getAllBlogSlugs)
}

export async function fetchAthletes(): Promise<Athlete[]> {
  return sanityClient.fetch(getAthletes)
}

export async function fetchRetailers(): Promise<Retailer[]> {
  return sanityClient.fetch(getRetailers)
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return sanityClient.fetch(getTestimonials)
}

// ---------------------------------------------------------------------------
// Task 4.1 — named aliases with averageRating / reviewCount
// ---------------------------------------------------------------------------

/**
 * Fetch a single product by slug with review aggregates.
 * Alias used on the product page (ISR).
 */
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    "name": name,
    "slug": slug.current,
    "category": category->slug.current,
    "shortDescription": shortDescription,
    "fullDescription": fullDescription,
    variants[]{
      _key,
      flavour,
      size,
      sku,
      gtin,
      price,
      compareAtPrice,
      stockLevel,
      imageOverride
    },
    basePrice,
    compareAtPrice,
    "imageGallery": imageGallery[]{
      _type,
      asset,
      alt,
      hotspot
    },
    nutritionalValues,
    ingredients,
    allergens,
    faq[]{
      _key,
      question,
      answer
    },
    status,
    eligibleForSubscription,
    seoTitle,
    seoDescription,
    "averageRating": math::avg(*[_type == "review" && productId == ^._id && status == "approved"].rating),
    "reviewCount": count(*[_type == "review" && productId == ^._id && status == "approved"])
  }
`

/**
 * Fetch all active product slugs for generateStaticParams.
 * Returns array of objects: { slug }
 */
export const allProductSlugsQuery = groq`
  *[_type == "product" && status == "active"]{
    "slug": slug.current
  }
`

/**
 * Fetch up to 4 related products in the same category, excluding the current slug.
 */
export const relatedProductsQuery = groq`
  *[
    _type == "product" &&
    status == "active" &&
    category->slug.current == $category &&
    slug.current != $slug
  ] | order(_createdAt desc) [0...4] {
    _id,
    "name": name,
    "slug": slug.current,
    "category": category->slug.current,
    "shortDescription": shortDescription,
    basePrice,
    compareAtPrice,
    "mainImage": imageGallery[0],
    variants[]{
      _key,
      flavour,
      size,
      sku,
      gtin,
      price,
      compareAtPrice,
      stockLevel,
      imageOverride
    },
    eligibleForSubscription,
    isBundleItem
  }
`
