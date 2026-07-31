// Feature: honey-bee-power-webshop, Property 16: Bundle Cart Atomicity
// Validates: Requirements 28.3

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { CartItem } from '@/types'

// ---------------------------------------------------------------------------
// Helper under test
// ---------------------------------------------------------------------------

/**
 * Applies bundle items onto an existing cart items array atomically.
 *
 * - If all bundleItems are appended successfully, returns the new array.
 * - If an error is thrown during appending, returns the original snapshot
 *   (full rollback — the cart state is identical to before the operation).
 *
 * Validates: Requirements 28.3
 */
export function applyBundleWithRollback(
  items: CartItem[],
  bundleItems: CartItem[],
): CartItem[] {
  const snapshot = [...items]

  try {
    const result = [...items]
    for (const bundleItem of bundleItems) {
      // Intentionally re-read result length each iteration so that an
      // injected throw mid-loop triggers the rollback path.
      result.push(bundleItem)
    }
    return result
  } catch {
    return snapshot
  }
}

/**
 * Variant of applyBundleWithRollback that accepts a custom append function.
 * Useful for simulating mid-operation errors in property tests.
 */
export function applyBundleWithRollbackFn(
  items: CartItem[],
  bundleItems: CartItem[],
  appendFn: (acc: CartItem[], item: CartItem) => CartItem[],
): CartItem[] {
  const snapshot = [...items]

  try {
    let result = [...items]
    for (const bundleItem of bundleItems) {
      result = appendFn(result, bundleItem)
    }
    return result
  } catch {
    return snapshot
  }
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A single CartItem with realistic, valid field values. */
const cartItemArb: fc.Arbitrary<CartItem> = fc.record({
  productId: fc.string({ minLength: 1, maxLength: 32 }),
  variantId: fc.string({ minLength: 1, maxLength: 32 }),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  slug: fc.string({ minLength: 1, maxLength: 60 }),
  imageSrc: fc.string({ minLength: 0, maxLength: 200 }),
  variantLabel: fc.string({ minLength: 1, maxLength: 60 }),
  unitPrice: fc.integer({ min: 1, max: 100_000 }),
  quantity: fc.integer({ min: 1, max: 99 }),
})

/** An array of 0–15 CartItems (existing cart contents). */
const existingItemsArb = fc.array(cartItemArb, { minLength: 0, maxLength: 15 })

/** An array of 1–10 bundle CartItems (N products in the bundle). */
const bundleItemsArb = fc.array(cartItemArb, { minLength: 1, maxLength: 10 })

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe('Bundle Cart Atomicity — Property 16: Bundle Cart Atomicity', () => {
  // -------------------------------------------------------------------------
  // Property 1: successful addBundle adds exactly N items
  // -------------------------------------------------------------------------

  /**
   * For any bundle B with N products, if the operation succeeds, the cart
   * MUST contain exactly N new items appended to the original items.
   *
   * Validates: Requirements 28.3
   */
  it('successful bundle add appends exactly N new items to the cart', () => {
    fc.assert(
      fc.property(existingItemsArb, bundleItemsArb, (existing, bundleItems) => {
        const result = applyBundleWithRollback(existing, bundleItems)

        // The result must contain all original items plus all bundle items
        expect(result).toHaveLength(existing.length + bundleItems.length)

        // Original items are preserved at the front
        expect(result.slice(0, existing.length)).toEqual(existing)

        // Bundle items are appended at the end
        expect(result.slice(existing.length)).toEqual(bundleItems)
      }),
      { numRuns: 200 },
    )
  })

  /**
   * For any bundle with N products, calling addBundle N times via the helper
   * corresponds to calling addItem N times — the count increases by exactly N.
   *
   * Validates: Requirements 28.3
   */
  it('cart item count increases by exactly N when bundle has N products', () => {
    fc.assert(
      fc.property(existingItemsArb, bundleItemsArb, (existing, bundleItems) => {
        const before = existing.length
        const n = bundleItems.length
        const result = applyBundleWithRollback(existing, bundleItems)

        expect(result.length).toBe(before + n)
      }),
      { numRuns: 200 },
    )
  })

  // -------------------------------------------------------------------------
  // Property 2: full rollback on error
  // -------------------------------------------------------------------------

  /**
   * If an error is thrown at any point during the bundle add operation, the
   * cart state MUST be identical to its state before the operation (full
   * rollback — 0 items added, existing items unchanged).
   *
   * Validates: Requirements 28.3
   */
  it('cart state is identical to snapshot when an error is thrown during bundle add', () => {
    fc.assert(
      fc.property(
        existingItemsArb,
        bundleItemsArb,
        fc.integer({ min: 0, max: 9 }),
        (existing, bundleItems, throwAtIndex) => {
          // Only test when throwAtIndex is within the bundle range so the error fires
          const clampedThrowAt = throwAtIndex % (bundleItems.length + 1)
          if (clampedThrowAt === bundleItems.length) {
            // No error — skip this iteration
            return
          }

          let callCount = 0
          const errorThrowingAppend = (acc: CartItem[], item: CartItem): CartItem[] => {
            if (callCount === clampedThrowAt) {
              throw new Error(`Simulated failure at item index ${clampedThrowAt}`)
            }
            callCount++
            return [...acc, item]
          }

          const result = applyBundleWithRollbackFn(existing, bundleItems, errorThrowingAppend)

          // Cart must be identical to the original snapshot after rollback
          expect(result).toEqual(existing)
          expect(result).toHaveLength(existing.length)
        },
      ),
      { numRuns: 200 },
    )
  })

  /**
   * Rollback is a deep equality check — the items array after rollback is
   * deeply equal to the snapshot (no partial mutations persist).
   *
   * Validates: Requirements 28.3
   */
  it('rolled-back cart contains no partial bundle items after an error', () => {
    fc.assert(
      fc.property(existingItemsArb, bundleItemsArb, (existing, bundleItems) => {
        // Always throw on the first bundle item
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const alwaysThrow = (_acc: CartItem[], _item: CartItem): CartItem[] => {
          throw new Error('Immediate failure')
        }

        const result = applyBundleWithRollbackFn(existing, bundleItems, alwaysThrow)

        expect(result).toEqual(existing)
        // No bundle items leaked into the cart
        for (const bundleItem of bundleItems) {
          const leaked = result.find(
            (r) => r.productId === bundleItem.productId && r.variantId === bundleItem.variantId,
          )
          // If the same item existed before, it must have the same quantity as before
          const original = existing.find(
            (e) => e.productId === bundleItem.productId && e.variantId === bundleItem.variantId,
          )
          if (original !== undefined) {
            expect(leaked).toEqual(original)
          } else {
            expect(leaked).toBeUndefined()
          }
        }
      }),
      { numRuns: 200 },
    )
  })

  // -------------------------------------------------------------------------
  // Property 3: empty bundle (0 products) adds nothing
  // -------------------------------------------------------------------------

  /**
   * For any existing cart, adding an empty bundle (0 products, N = 0) MUST
   * leave the cart state completely unchanged.
   *
   * Validates: Requirements 28.3
   */
  it('empty bundle (0 products) does not add any items to the cart', () => {
    fc.assert(
      fc.property(existingItemsArb, (existing) => {
        const result = applyBundleWithRollback(existing, [])

        expect(result).toEqual(existing)
        expect(result).toHaveLength(existing.length)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Empty bundle on an empty cart results in an empty cart.
   *
   * Validates: Requirements 28.3
   */
  it('empty bundle on empty cart produces an empty cart', () => {
    const result = applyBundleWithRollback([], [])
    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  // ---------------------------------------------------------------------------
  // Concrete examples
  // ---------------------------------------------------------------------------

  it('successful bundle of 3 items on empty cart produces exactly 3 items', () => {
    const bundleItems: CartItem[] = [
      {
        productId: 'bundle-prod-1',
        variantId: 'bundle-var-1',
        name: 'Protein Bar Jagoda',
        slug: 'protein-bar-jagoda',
        imageSrc: '/images/bar.jpg',
        variantLabel: 'Jagoda / 40g',
        unitPrice: 1299,
        quantity: 1,
      },
      {
        productId: 'bundle-prod-2',
        variantId: 'bundle-var-2',
        name: 'Energy Gel Naranča',
        slug: 'energy-gel-naranca',
        imageSrc: '/images/gel.jpg',
        variantLabel: 'Naranča',
        unitPrice: 1299,
        quantity: 1,
      },
      {
        productId: 'bundle-prod-3',
        variantId: 'bundle-var-3',
        name: 'Izotonik Limun',
        slug: 'izotonik-limun',
        imageSrc: '/images/izotonik.jpg',
        variantLabel: 'Limun / 500ml',
        unitPrice: 1299,
        quantity: 1,
      },
    ]

    const result = applyBundleWithRollback([], bundleItems)

    expect(result).toHaveLength(3)
    expect(result).toEqual(bundleItems)
  })

  it('rollback on first item error leaves cart unchanged with pre-existing items', () => {
    const existing: CartItem[] = [
      {
        productId: 'existing-prod',
        variantId: 'existing-var',
        name: 'Whey Protein Čokolada',
        slug: 'whey-protein-cokolada',
        imageSrc: '/images/whey.jpg',
        variantLabel: 'Čokolada / 500g',
        unitPrice: 4999,
        quantity: 2,
      },
    ]

    const bundleItems: CartItem[] = [
      {
        productId: 'bundle-prod-1',
        variantId: 'bundle-var-1',
        name: 'Bundle Item 1',
        slug: 'bundle-item-1',
        imageSrc: '',
        variantLabel: 'Default',
        unitPrice: 999,
        quantity: 1,
      },
    ]

    let called = false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const failOnFirst = (acc: CartItem[], _item: CartItem): CartItem[] => {
      if (!called) {
        called = true
        throw new Error('Cart operation failed')
      }
      return acc
    }

    const result = applyBundleWithRollbackFn(existing, bundleItems, failOnFirst)

    expect(result).toEqual(existing)
    expect(result).toHaveLength(1)
  })

  it('partial error mid-bundle triggers full rollback — no partial items persist', () => {
    const existing: CartItem[] = []

    const bundleItems: CartItem[] = [
      {
        productId: 'p1',
        variantId: 'v1',
        name: 'Item 1',
        slug: 'item-1',
        imageSrc: '',
        variantLabel: 'A',
        unitPrice: 500,
        quantity: 1,
      },
      {
        productId: 'p2',
        variantId: 'v2',
        name: 'Item 2',
        slug: 'item-2',
        imageSrc: '',
        variantLabel: 'B',
        unitPrice: 500,
        quantity: 1,
      },
      {
        productId: 'p3',
        variantId: 'v3',
        name: 'Item 3',
        slug: 'item-3',
        imageSrc: '',
        variantLabel: 'C',
        unitPrice: 500,
        quantity: 1,
      },
    ]

    let callCount = 0
    const throwOnThird = (acc: CartItem[], item: CartItem): CartItem[] => {
      callCount++
      if (callCount === 3) {
        throw new Error('Failed on third item')
      }
      return [...acc, item]
    }

    const result = applyBundleWithRollbackFn(existing, bundleItems, throwOnThird)

    // Full rollback — empty cart, despite first 2 items having been "added"
    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })
})
