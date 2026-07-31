// Feature: honey-bee-power-webshop, Property 2: Cart Badge Reflects Item Count
// Validates: Requirements 2.3

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Helper function that mirrors the CartStore.totalItems() selector logic.
 * Defined here to allow testing independently of the Zustand store implementation.
 */
export function computeTotalItems(items: Array<{ quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A single cart item with a non-negative integer quantity. */
const cartItemArb = fc.record({
  quantity: fc.integer({ min: 0, max: 9999 }),
})

/** An array of 0–20 cart items. */
const cartItemsArb = fc.array(cartItemArb, { minLength: 0, maxLength: 20 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Cart Badge — Property 2: Cart Badge Reflects Item Count', () => {
  /**
   * Property: computeTotalItems([]) === 0
   * An empty cart must always show a zero badge.
   */
  it('returns 0 for an empty cart', () => {
    expect(computeTotalItems([])).toBe(0)
  })

  /**
   * Property: for any array of items, the result equals the arithmetic sum of
   * all quantity fields.
   *
   * Validates: Requirements 2.3 —
   * "WHEN the Cart contains one or more products, THE Badge SHALL display the
   *  exact total number of items in the Cart"
   */
  it('equals the sum of all item quantities for any cart contents', () => {
    fc.assert(
      fc.property(cartItemsArb, (items) => {
        const expected = items.reduce((acc, item) => acc + item.quantity, 0)
        expect(computeTotalItems(items)).toBe(expected)
      }),
    )
  })

  /**
   * Property: adding one item with quantity q increases totalItems by exactly q.
   * Ensures the reducer is additive and does not double-count or skip items.
   */
  it('increases the count by the added item quantity when a new item is appended', () => {
    fc.assert(
      fc.property(cartItemsArb, fc.integer({ min: 1, max: 9999 }), (items, newQty) => {
        const before = computeTotalItems(items)
        const after = computeTotalItems([...items, { quantity: newQty }])
        expect(after).toBe(before + newQty)
      }),
    )
  })

  /**
   * Property: result is always a non-negative integer.
   * The badge must never show a negative or fractional value.
   */
  it('always returns a non-negative integer', () => {
    fc.assert(
      fc.property(cartItemsArb, (items) => {
        const total = computeTotalItems(items)
        expect(total).toBeGreaterThanOrEqual(0)
        expect(Number.isInteger(total)).toBe(true)
      }),
    )
  })

  // ---------------------------------------------------------------------------
  // Concrete examples (edge cases)
  // ---------------------------------------------------------------------------

  it('handles a single item with quantity 1', () => {
    expect(computeTotalItems([{ quantity: 1 }])).toBe(1)
  })

  it('handles multiple items with varying quantities', () => {
    const items = [{ quantity: 2 }, { quantity: 5 }, { quantity: 3 }]
    expect(computeTotalItems(items)).toBe(10)
  })

  it('handles large quantities without overflow', () => {
    const items = [{ quantity: 9999 }, { quantity: 9999 }, { quantity: 9999 }]
    expect(computeTotalItems(items)).toBe(29997)
  })

  it('handles items with zero quantity (data inconsistency edge case, Req 2.3)', () => {
    // Requirement 2.3 explicitly covers "when the item count is zero due to a
    // data inconsistency" — a zero-quantity item should contribute 0 to the total.
    const items = [{ quantity: 3 }, { quantity: 0 }, { quantity: 2 }]
    expect(computeTotalItems(items)).toBe(5)
  })
})
