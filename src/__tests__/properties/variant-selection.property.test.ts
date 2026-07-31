// Feature: honey-bee-power-webshop, Property 7: Variant Selection Updates Display
// Validates: Requirements 10.4

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Resolves the display price after a variant is selected.
 *
 * Rule: if the variant carries a positive price, use it; otherwise
 * fall back to the product's base price.
 *
 * @param variantPrice - The variant's own price in cents (may be 0 or negative
 *                       when the CMS field is unset / invalid)
 * @param basePrice    - The product-level base price in cents (always > 0)
 */
export function resolveVariantPrice(
  variantPrice: number,
  basePrice: number,
): number {
  return variantPrice > 0 ? variantPrice : basePrice
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A positive base price in cents (1 – 100 000). */
const basePriceArb = fc.integer({ min: 1, max: 100_000 })

/** A variant price that is strictly positive — variant price must be used. */
const posVariantPriceArb = fc.integer({ min: 1, max: 100_000 })

/** A variant price that is zero or negative — base price must be used. */
const nonPositiveVariantPriceArb = fc.integer({ min: -100_000, max: 0 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Variant Selection — Property 7: Variant Selection Updates Display', () => {
  /**
   * When variantPrice > 0, the displayed price MUST equal variantPrice.
   *
   * Validates: Requirements 10.4 —
   * displayed price = V.price > 0 ? V.price : product.basePrice
   */
  it('returns variantPrice when variantPrice is positive', () => {
    fc.assert(
      fc.property(posVariantPriceArb, basePriceArb, (variantPrice, basePrice) => {
        expect(resolveVariantPrice(variantPrice, basePrice)).toBe(variantPrice)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * When variantPrice <= 0 (unset / invalid), the displayed price MUST equal
   * basePrice.
   */
  it('returns basePrice when variantPrice is zero or negative', () => {
    fc.assert(
      fc.property(
        nonPositiveVariantPriceArb,
        basePriceArb,
        (variantPrice, basePrice) => {
          expect(resolveVariantPrice(variantPrice, basePrice)).toBe(basePrice)
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * The resolved price is always positive (>0) given a valid positive basePrice.
   * Ensures the UI never renders a zero or negative price.
   */
  it('always returns a positive price for any input when basePrice > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100_000, max: 100_000 }),
        basePriceArb,
        (variantPrice, basePrice) => {
          const resolved = resolveVariantPrice(variantPrice, basePrice)
          expect(resolved).toBeGreaterThan(0)
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Full formula invariant: result === variantPrice > 0 ? variantPrice : basePrice
   * Tests the exact specification expression across all input combinations.
   */
  it('exactly matches the formula V.price > 0 ? V.price : product.basePrice for all inputs', () => {
    const anyVariantPriceArb = fc.integer({ min: -100_000, max: 100_000 })

    fc.assert(
      fc.property(anyVariantPriceArb, basePriceArb, (variantPrice, basePrice) => {
        const expected = variantPrice > 0 ? variantPrice : basePrice
        expect(resolveVariantPrice(variantPrice, basePrice)).toBe(expected)
      }),
      { numRuns: 200 },
    )
  })

  /**
   * Idempotency: calling resolveVariantPrice twice with the same inputs
   * always returns the same value (pure function, no side effects).
   */
  it('is idempotent — same inputs always produce the same output', () => {
    const anyVariantPriceArb = fc.integer({ min: -100_000, max: 100_000 })

    fc.assert(
      fc.property(anyVariantPriceArb, basePriceArb, (variantPrice, basePrice) => {
        expect(resolveVariantPrice(variantPrice, basePrice)).toBe(
          resolveVariantPrice(variantPrice, basePrice),
        )
      }),
      { numRuns: 100 },
    )
  })

  // ---------------------------------------------------------------------------
  // Concrete examples (edge cases)
  // ---------------------------------------------------------------------------

  it('uses variantPrice when it is 1 cent (minimum positive)', () => {
    expect(resolveVariantPrice(1, 1000)).toBe(1)
  })

  it('uses basePrice when variantPrice is exactly 0', () => {
    expect(resolveVariantPrice(0, 1000)).toBe(1000)
  })

  it('uses basePrice when variantPrice is negative', () => {
    expect(resolveVariantPrice(-500, 1000)).toBe(1000)
  })

  it('uses variantPrice when both variantPrice and basePrice are equal positive values', () => {
    // Both are positive — variantPrice > 0, so variantPrice wins
    expect(resolveVariantPrice(800, 800)).toBe(800)
  })

  it('uses variantPrice for a typical sale variant: variant 699, base 999', () => {
    expect(resolveVariantPrice(699, 999)).toBe(699)
  })

  it('uses basePrice for a variant with no price override (0)', () => {
    expect(resolveVariantPrice(0, 2490)).toBe(2490)
  })

  it('uses variantPrice for a premium variant: variant 1499, base 999', () => {
    expect(resolveVariantPrice(1499, 999)).toBe(1499)
  })
})
