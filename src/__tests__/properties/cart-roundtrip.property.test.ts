// Feature: honey-bee-power-webshop, Property 10: Cart LocalStorage Round-Trip
// Validates: Requirements 12.8

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { CartItem } from '@/types'

// ---------------------------------------------------------------------------
// Helpers under test
// ---------------------------------------------------------------------------

/**
 * Serializes an array of cart items to a JSON string for localStorage storage.
 */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items)
}

/**
 * Deserializes a JSON string back into an array of cart items.
 */
export function deserializeCart(data: string): CartItem[] {
  return JSON.parse(data) as CartItem[]
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A single CartItem with realistic, valid field values. */
const cartItemArb: fc.Arbitrary<CartItem> = fc.record({
  productId: fc.string(),
  variantId: fc.string(),
  name: fc.string(),
  slug: fc.string(),
  imageSrc: fc.string(),
  variantLabel: fc.string(),
  unitPrice: fc.integer({ min: 1, max: 100_000 }),
  quantity: fc.integer({ min: 1, max: 99 }),
})

/** An array of 0–20 CartItems. */
const cartItemsArb = fc.array(cartItemArb, { minLength: 0, maxLength: 20 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Cart LocalStorage Round-Trip — Property 10: Cart LocalStorage Round-Trip', () => {
  /**
   * Core property: serialize → deserialize is a no-op (deep equality).
   * Any array of CartItems survives a localStorage round-trip without data loss
   * or mutation.
   *
   * Validates: Requirements 12.8
   */
  it('deserialize(serialize(items)) deep-equals original items for any CartItem array', () => {
    fc.assert(
      fc.property(cartItemsArb, (items) => {
        const serialized = serializeCart(items)
        const deserialized = deserializeCart(serialized)
        expect(deserialized).toEqual(items)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: The round-trip preserves the exact number of items.
   */
  it('preserves the length of the cart after round-trip', () => {
    fc.assert(
      fc.property(cartItemsArb, (items) => {
        const deserialized = deserializeCart(serializeCart(items))
        expect(deserialized).toHaveLength(items.length)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: Each item's numeric fields (unitPrice, quantity) are preserved
   * as numbers, not coerced to strings.
   */
  it('preserves numeric field types through the round-trip', () => {
    fc.assert(
      fc.property(cartItemsArb, (items) => {
        const deserialized = deserializeCart(serializeCart(items))
        deserialized.forEach((item) => {
          expect(typeof item.unitPrice).toBe('number')
          expect(typeof item.quantity).toBe('number')
        })
      }),
      { numRuns: 100 },
    )
  })

  // ---------------------------------------------------------------------------
  // Concrete examples
  // ---------------------------------------------------------------------------

  it('round-trips an empty cart', () => {
    expect(deserializeCart(serializeCart([]))).toEqual([])
  })

  it('round-trips a single item', () => {
    const items: CartItem[] = [
      {
        productId: 'prod-1',
        variantId: 'var-1',
        name: 'Protein Bar Jagoda',
        slug: 'protein-bar-jagoda',
        imageSrc: '/images/bar.jpg',
        variantLabel: 'Jagoda / 40g',
        unitPrice: 349,
        quantity: 2,
      },
    ]
    expect(deserializeCart(serializeCart(items))).toEqual(items)
  })

  it('round-trips multiple items with varied fields', () => {
    const items: CartItem[] = [
      {
        productId: 'prod-a',
        variantId: 'var-a1',
        name: 'Whey Protein Čokolada',
        slug: 'whey-protein-cokolada',
        imageSrc: '/images/whey.jpg',
        variantLabel: 'Čokolada / 500g',
        unitPrice: 4999,
        quantity: 1,
      },
      {
        productId: 'prod-b',
        variantId: 'var-b1',
        name: 'Energy Gel',
        slug: 'energy-gel',
        imageSrc: '/images/gel.jpg',
        variantLabel: 'Naranča',
        unitPrice: 199,
        quantity: 10,
      },
    ]
    expect(deserializeCart(serializeCart(items))).toEqual(items)
  })

  it('preserves unicode characters in string fields', () => {
    const items: CartItem[] = [
      {
        productId: 'prod-unicode',
        variantId: 'var-unicode',
        name: 'Protein Štrukle',
        slug: 'protein-strukle',
        imageSrc: '/images/strukle.jpg',
        variantLabel: 'Šumsko voće / 200g',
        unitPrice: 799,
        quantity: 3,
      },
    ]
    expect(deserializeCart(serializeCart(items))).toEqual(items)
  })
})
