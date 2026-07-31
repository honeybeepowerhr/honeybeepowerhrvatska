// Feature: honey-bee-power-webshop, Property 9: Free Shipping Progress Bar Calculation
// Validates: Requirements 12.3, 12.4

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Calculates how much more the user needs to spend to reach the free shipping
 * threshold. Returns 0 when the cart total already meets or exceeds the threshold.
 *
 * @param cartTotal  - Current cart total in cents (>= 0)
 * @param threshold  - Free shipping threshold in cents (> 0)
 */
export function calculateRemainingForFreeShipping(
  cartTotal: number,
  threshold: number,
): number {
  return Math.max(0, threshold - cartTotal)
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Cart total in cents: 0 – 1 000 000 */
const cartTotalArb = fc.integer({ min: 0, max: 1_000_000 })

/** Threshold in cents: 1 – 1 000 000 */
const thresholdArb = fc.integer({ min: 1, max: 1_000_000 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Free Shipping Calculation — Property 9: Free Shipping Progress Bar Calculation', () => {
  /**
   * Property: When cartTotal >= threshold, remaining === 0.
   * The progress bar should show "free shipping unlocked".
   *
   * Validates: Requirements 12.4
   */
  it('returns 0 when cart total meets or exceeds the threshold', () => {
    fc.assert(
      fc.property(
        thresholdArb.chain((threshold) =>
          fc.integer({ min: threshold, max: threshold + 1_000_000 }).map((cartTotal) => ({
            cartTotal,
            threshold,
          })),
        ),
        ({ cartTotal, threshold }) => {
          expect(calculateRemainingForFreeShipping(cartTotal, threshold)).toBe(0)
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Property: When cartTotal < threshold, remaining === threshold - cartTotal.
   * The progress bar should show the exact gap to fill.
   *
   * Validates: Requirements 12.3
   */
  it('returns threshold - cartTotal when cart total is below the threshold', () => {
    fc.assert(
      fc.property(
        thresholdArb.chain((threshold) =>
          fc.integer({ min: 0, max: threshold - 1 }).map((cartTotal) => ({
            cartTotal,
            threshold,
          })),
        ),
        ({ cartTotal, threshold }) => {
          expect(calculateRemainingForFreeShipping(cartTotal, threshold)).toBe(
            threshold - cartTotal,
          )
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Property: The result is always >= 0 for any combination of inputs.
   * The progress bar must never display a negative "remaining" amount.
   *
   * Validates: Requirements 12.3
   */
  it('always returns a non-negative value', () => {
    fc.assert(
      fc.property(cartTotalArb, thresholdArb, (cartTotal, threshold) => {
        expect(calculateRemainingForFreeShipping(cartTotal, threshold)).toBeGreaterThanOrEqual(0)
      }),
      { numRuns: 100 },
    )
  })

  // ---------------------------------------------------------------------------
  // Concrete examples
  // ---------------------------------------------------------------------------

  it('returns the full threshold when cart is empty', () => {
    expect(calculateRemainingForFreeShipping(0, 3000)).toBe(3000)
  })

  it('returns the exact gap when partially filled', () => {
    expect(calculateRemainingForFreeShipping(1500, 3000)).toBe(1500)
  })

  it('returns 0 when cart total exactly equals threshold', () => {
    expect(calculateRemainingForFreeShipping(3000, 3000)).toBe(0)
  })

  it('returns 0 when cart total exceeds threshold', () => {
    expect(calculateRemainingForFreeShipping(5000, 3000)).toBe(0)
  })

  it('returns 1 cent remaining when just 1 cent short', () => {
    expect(calculateRemainingForFreeShipping(2999, 3000)).toBe(1)
  })
})
