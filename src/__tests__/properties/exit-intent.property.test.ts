// Feature: honey-bee-power-webshop, Property 5: Exit-Intent Popup Suppression
// Validates: Requirements 8.4, 8.5

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { shouldShowPopup } from '@/features/exit-intent/logic'

describe('Property 5: Exit-Intent Popup Suppression', () => {
  /**
   * Property: IF hasClosedToday is true, shouldShowPopup MUST ALWAYS evaluate to false,
   * regardless of whether exit-intent is detected.
   *
   * Validates: Requirements 8.4, 8.5
   */
  it('suppresses popup if user has closed it today', () => {
    fc.assert(
      fc.property(fc.boolean(), (exitIntentDetected) => {
        const result = shouldShowPopup(exitIntentDetected, true)
        expect(result).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: IF hasClosedToday is false AND exitIntentDetected is true, shouldShowPopup MUST evaluate to true.
   *
   * Validates: Requirements 8.4, 8.5
   */
  it('shows popup only when exit-intent is detected and user has NOT closed it today', () => {
    fc.assert(
      fc.property(fc.boolean(), fc.boolean(), (exitIntentDetected, hasClosedToday) => {
        const result = shouldShowPopup(exitIntentDetected, hasClosedToday)
        expect(result).toBe(exitIntentDetected && !hasClosedToday)
      }),
      { numRuns: 100 },
    )
  })
})
