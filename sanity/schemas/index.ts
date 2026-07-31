// Sanity schema registry
// Task 2.2: category, variant, product
// Task 2.3: blogPost, athlete, faq, testimonial, retailer, bundle

import type { SchemaTypeDefinition } from 'sanity'

// ── Task 2.2 schemas (created in parallel) ──────────────────────────────────
import { categoryType } from './category'
import { variantType } from './variant'
import { productType } from './product'
import { nutritionalRowType } from './nutritionalRow'
import { nutritionalTableType } from './nutritionalTable'

// ── Task 2.3 schemas ────────────────────────────────────────────────────────
import { blogPostType } from './blogPost'
import { athleteType } from './athlete'
import { faqType } from './faq'
import { testimonialType } from './testimonial'
import { retailerType } from './retailer'
import { bundleType } from './bundle'
import { inquiryType } from './inquiry'

export const schemaTypes: SchemaTypeDefinition[] = [
  // ── Task 2.2 ──────────────────────────────────────────────────────────────
  categoryType,
  variantType,
  productType,
  nutritionalRowType,
  nutritionalTableType,

  // ── Task 2.3 ──────────────────────────────────────────────────────────────
  blogPostType,
  athleteType,
  faqType,
  testimonialType,
  retailerType,
  bundleType,
  inquiryType,
]
