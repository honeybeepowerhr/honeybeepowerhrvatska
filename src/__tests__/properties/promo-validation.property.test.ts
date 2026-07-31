// Feature: honey-bee-power-webshop, Property 3: Promotion Price Display Invariant
// Validates: Requirements 4.4

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Determines whether a strikethrough compareAtPrice should be displayed.
 *
 * The invariant: compareAtPrice is shown IF AND ONLY IF
 *   compareAtPrice !== null && compareAtPrice !== undefined && compareAtPrice > basePrice
 *
 * @param basePrice     - The product's base price (must be > 0)
 * @param compareAtPrice - The optional original / "compare at" price from CMS
 */
export function shouldShowCompareAtPrice(
  basePrice: number,
  compareAtPrice: number | null | undefined,
): boolean {
  if (compareAtPrice === null || compareAtPrice === undefined) {
    return false
  }
  return compareAtPrice > basePrice
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A positive base price in cents (1 – 100 000). */
const basePriceArb = fc.integer({ min: 1, max: 100_000 })

/** compareAtPrice that is strictly greater than basePrice — should show. */
const compareAtGreaterArb = (basePrice: number) =>
  fc.integer({ min: basePrice + 1, max: basePrice + 100_000 })

/** compareAtPrice equal to basePrice — should NOT show. */
const compareAtEqualArb = (basePrice: number) => fc.constant(basePrice)

/** compareAtPrice strictly less than basePrice — should NOT show. */
const compareAtLesserArb = (basePrice: number) =>
  fc.integer({ min: 1, max: basePrice }).filter((v) => v < basePrice)

/** compareAtPrice that is zero or negative — should NOT show. */
const compareAtNonPositiveArb = fc.integer({ min: -100_000, max: 0 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Promotion Price Display — Property 3: Promotion Price Display Invariant', () => {
  /**
   * Core invariant: shouldShowCompareAtPrice returns true IF AND ONLY IF
   * compareAtPrice is a number strictly greater than basePrice.
   *
   * Validates: Requirements 4.4
   */
  it('shows compareAtPrice when it is strictly greater than basePrice', () => {
    fc.assert(
      fc.property(
        basePriceArb.chain((base) =>
          compareAtGreaterArb(base).map((cap) => ({ base, cap })),
        ),
        ({ base, cap }) => {
          expect(shouldShowCompareAtPrice(base, cap)).toBe(true)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('does NOT show compareAtPrice when it equals basePrice', () => {
    fc.assert(
      fc.property(
        basePriceArb.chain((base) =>
          compareAtEqualArb(base).map((cap) => ({ base, cap })),
        ),
        ({ base, cap }) => {
          expect(shouldShowCompareAtPrice(base, cap)).toBe(false)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('does NOT show compareAtPrice when it is strictly less than basePrice', () => {
    fc.assert(
      fc.property(
        basePriceArb
          .filter((base) => base > 1) // ensure room for a lesser value
          .chain((base) =>
            compareAtLesserArb(base).map((cap) => ({ base, cap })),
          ),
        ({ base, cap }) => {
          expect(shouldShowCompareAtPrice(base, cap)).toBe(false)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('does NOT show compareAtPrice when it is zero or negative', () => {
    fc.assert(
      fc.property(basePriceArb, compareAtNonPositiveArb, (base, cap) => {
        expect(shouldShowCompareAtPrice(base, cap)).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  it('does NOT show compareAtPrice when it is null', () => {
    fc.assert(
      fc.property(basePriceArb, (base) => {
        expect(shouldShowCompareAtPrice(base, null)).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  it('does NOT show compareAtPrice when it is undefined', () => {
    fc.assert(
      fc.property(basePriceArb, (base) => {
        expect(shouldShowCompareAtPrice(base, undefined)).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Biconditional invariant: the function returns true if and only if
   * compareAtPrice is a finite number strictly greater than basePrice.
   *
   * This single property encodes the full if-and-only-if requirement.
   */
  it('satisfies the full if-and-only-if invariant across all combinations', () => {
    const compareAtArb = fc.oneof(
      fc.constant(null),
      fc.constant(undefined),
      fc.integer({ min: -100_000, max: 200_000 }),
    ) as fc.Arbitrary<number | null | undefined>

    fc.assert(
      fc.property(basePriceArb, compareAtArb, (base, cap) => {
        const shown = shouldShowCompareAtPrice(base, cap)
        const expected =
          cap !== null && cap !== undefined && cap > base

        expect(shown).toBe(expected)
      }),
      { numRuns: 200 },
    )
  })

  // ---------------------------------------------------------------------------
  // Concrete examples (edge cases)
  // ---------------------------------------------------------------------------

  it('shows when compareAtPrice is 1 cent above basePrice', () => {
    expect(shouldShowCompareAtPrice(1000, 1001)).toBe(true)
  })

  it('does NOT show when compareAtPrice equals basePrice exactly', () => {
    expect(shouldShowCompareAtPrice(500, 500)).toBe(false)
  })

  it('does NOT show when compareAtPrice is null (no promotion)', () => {
    expect(shouldShowCompareAtPrice(1000, null)).toBe(false)
  })

  it('does NOT show when compareAtPrice is undefined (field absent from CMS)', () => {
    expect(shouldShowCompareAtPrice(1000, undefined)).toBe(false)
  })

  it('does NOT show when compareAtPrice is 0', () => {
    expect(shouldShowCompareAtPrice(1000, 0)).toBe(false)
  })

  it('does NOT show when compareAtPrice is negative', () => {
    expect(shouldShowCompareAtPrice(1000, -500)).toBe(false)
  })

  it('shows correctly for typical product: 799 on sale from 999', () => {
    expect(shouldShowCompareAtPrice(799, 999)).toBe(true)
  })
})
