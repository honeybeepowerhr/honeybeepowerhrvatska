// Feature: honey-bee-power-webshop, Property 11: Promo Code Validation Round-Trip
// Validates: Requirements 13.8, 13.9

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validatePromoCode } from '@/features/checkout/schema'

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/**
 * Random strings that are guaranteed NOT to be "WELCOME10" (case-insensitive).
 * This covers the "unknown code" branch of validatePromoCode.
 */
const unknownCodeArb = fc.string({ minLength: 0, maxLength: 20 }).filter(
  (s) => s.trim().toUpperCase() !== 'WELCOME10',
)

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Promo Code Validation — Property 11: Promo Code Validation Round-Trip', () => {
  /**
   * Property: "WELCOME10" → valid: true, discountPercent: 10.
   * The only known promo code must always resolve to the correct discount.
   *
   * Validates: Requirements 13.8
   */
  it('"WELCOME10" returns valid: true with discountPercent 10', () => {
    const result = validatePromoCode('WELCOME10')
    expect(result.valid).toBe(true)
    expect(result.discountPercent).toBe(10)
  })

  /**
   * Property: Any string that is NOT "WELCOME10" (case-insensitive) → valid: false.
   * Unknown / typo / guessed codes must be rejected.
   *
   * Validates: Requirements 13.9
   */
  it('returns valid: false for any string that is not "WELCOME10"', () => {
    fc.assert(
      fc.property(unknownCodeArb, (code) => {
        const result = validatePromoCode(code)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: A valid promo code always returns discountPercent > 0.
   * No valid code should apply a zero or negative discount.
   *
   * Validates: Requirements 13.8
   */
  it('always returns discountPercent > 0 for the valid code', () => {
    const result = validatePromoCode('WELCOME10')
    expect(result.discountPercent).toBeGreaterThan(0)
  })

  /**
   * Property: validatePromoCode is case-insensitive — "welcome10", "Welcome10",
   * "WELCOME10" all resolve to the same valid result.
   *
   * Validates: Requirements 13.8
   */
  it('accepts "WELCOME10" regardless of casing', () => {
    const variants = ['welcome10', 'Welcome10', 'WELCOME10', 'wElCoMe10']
    for (const variant of variants) {
      const result = validatePromoCode(variant)
      expect(result.valid).toBe(true)
      expect(result.discountPercent).toBe(10)
    }
  })

  /**
   * Property: validatePromoCode is whitespace-tolerant — leading/trailing
   * spaces do not invalidate a valid code.
   *
   * Validates: Requirements 13.8
   */
  it('accepts "WELCOME10" with surrounding whitespace', () => {
    const result = validatePromoCode('  WELCOME10  ')
    expect(result.valid).toBe(true)
    expect(result.discountPercent).toBe(10)
  })

  // ---------------------------------------------------------------------------
  // Concrete examples
  // ---------------------------------------------------------------------------

  it('empty string → invalid', () => {
    const result = validatePromoCode('')
    expect(result.valid).toBe(false)
    expect(result.discountPercent).toBe(0)
  })

  it('random gibberish → invalid', () => {
    const result = validatePromoCode('NOTACODE')
    expect(result.valid).toBe(false)
  })

  it('partial code "WELCOME" → invalid', () => {
    const result = validatePromoCode('WELCOME')
    expect(result.valid).toBe(false)
  })

  it('"WELCOME10" returns a non-empty label', () => {
    const result = validatePromoCode('WELCOME10')
    expect(result.label.length).toBeGreaterThan(0)
  })

  it('invalid code returns an empty label', () => {
    const result = validatePromoCode('BADCODE')
    expect(result.label).toBe('')
  })
})
