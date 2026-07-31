// Feature: honey-bee-power-webshop, Property 8: Review Submission Requires Rating
// Validates: Requirements 11.3

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateReview } from '@/features/reviews/schema'

/** Arbitrary valid review input without rating specified */
const validReviewBaseArb = fc.record({
  productId: fc.constant('product-123'),
  title: fc.string({ minLength: 3, maxLength: 50 }).filter((s) => s.trim().length >= 3),
  body: fc.string({ minLength: 10, maxLength: 200 }).filter((s) => s.trim().length >= 10),
  author: fc.string({ minLength: 2, maxLength: 30 }).filter((s) => s.trim().length >= 2),
})

/** Arbitrary ratings outside valid range [1, 5] */
const invalidRatingArb = fc.oneof(
  fc.integer({ max: 0 }),
  fc.integer({ min: 6 }),
  fc.constant(NaN),
  fc.constant(undefined as unknown as number),
  fc.constant(null as unknown as number),
  fc.double({ min: 1.1, max: 1.9 }), // non-integer rating
)

/** Arbitrary valid integer rating [1, 5] */
const validRatingArb = fc.integer({ min: 1, max: 5 })

describe('Property 8: Review Submission Requires Rating', () => {
  /**
   * Property: Any review submission without a rating, or with a rating outside [1..5],
   * MUST fail validation with a rating error.
   *
   * Validates: Requirements 11.3
   */
  it('rejects review submissions with missing or invalid ratings', () => {
    fc.assert(
      fc.property(validReviewBaseArb, invalidRatingArb, (base, rating) => {
        const input = { ...base, rating }
        const result = validateReview(input)

        expect(result.success).toBe(false)
        expect(result.errors.rating).toBeDefined()
        expect(typeof result.errors.rating).toBe('string')
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: Submissions with valid rating [1..5] and valid fields MUST pass rating validation.
   *
   * Validates: Requirements 11.3
   */
  it('accepts review submissions with valid ratings 1 to 5', () => {
    fc.assert(
      fc.property(validReviewBaseArb, validRatingArb, (base, rating) => {
        const input = { ...base, rating }
        const result = validateReview(input)

        expect(result.errors.rating).toBeUndefined()
        expect(result.success).toBe(true)
        expect(result.data?.rating).toBe(rating)
      }),
      { numRuns: 100 },
    )
  })
})
