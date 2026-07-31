// Feature: honey-bee-power-webshop, Property 15: Analytics Consent Enforcement
// Validates: Requirements 19.7

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { shouldLoadAnalytics } from '@/features/analytics/logic'

describe('Property 15: Analytics Consent Enforcement', () => {
  /**
   * Property: WHEN user rejects consent (consentGranted = false),
   * shouldLoadAnalytics MUST evaluate to false (blocking tracking scripts).
   *
   * Validates: Requirement 19.7
   */
  it('blocks tracking scripts when consent is denied', () => {
    fc.assert(
      fc.property(fc.constant(false), (consentGranted) => {
        const canLoad = shouldLoadAnalytics(consentGranted)
        expect(canLoad).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: WHEN user accepts consent (consentGranted = true),
   * shouldLoadAnalytics MUST evaluate to true.
   *
   * Validates: Requirement 19.7
   */
  it('enables tracking scripts when consent is granted', () => {
    fc.assert(
      fc.property(fc.constant(true), (consentGranted) => {
        const canLoad = shouldLoadAnalytics(consentGranted)
        expect(canLoad).toBe(true)
      }),
      { numRuns: 100 },
    )
  })
})
