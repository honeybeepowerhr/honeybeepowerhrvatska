// Feature: honey-bee-power-webshop, Property 14: B2B Form Zod Validation Gate
// Validates: Requirements 20.3

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateB2BForm, type B2BFormValues } from '@/features/b2b/schema'

/** Valid B2B form arbitrary */
const validB2BFormArb: fc.Arbitrary<B2BFormValues> = fc.record({
  companyName: fc.string({ minLength: 2, maxLength: 50 }).filter((s) => s.trim().length >= 2),
  contactPerson: fc.string({ minLength: 2, maxLength: 40 }).filter((s) => s.trim().length >= 2),
  email: fc
    .tuple(
      fc.stringMatching(/^[a-z0-9]{3,8}$/),
      fc.stringMatching(/^[a-z0-9]{3,8}$/),
      fc.stringMatching(/^[a-z]{2,4}$/),
    )
    .map(([user, domain, tld]) => `${user}@${domain}.${tld}`),
  phone: fc.stringMatching(/^\+?[0-9]{6,15}$/),
  cooperationType: fc.constantFrom('distributer', 'maloprodaja', 'klub', 'teretana', 'ostalo'),
  message: fc.string({ minLength: 10, maxLength: 200 }).filter((s) => s.trim().length >= 10),
})

/** Invalid company name arbitrary */
const invalidCompanyNameArb = fc.oneof(
  fc.constant(''),
  fc.constant(' '),
  fc.constant('A'),
)

describe('Property 14: B2B Form Zod Validation Gate', () => {
  /**
   * Property: Any B2B form with valid fields MUST pass validation with no errors.
   *
   * Validates: Requirements 20.3
   */
  it('accepts fully valid B2B form inputs', () => {
    fc.assert(
      fc.property(validB2BFormArb, (form) => {
        const result = validateB2BForm(form)
        expect(result.success).toBe(true)
        expect(Object.keys(result.errors)).toHaveLength(0)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: Any B2B form with an empty/invalid companyName MUST produce a companyName error.
   *
   * Validates: Requirements 20.3
   */
  it('rejects B2B form inputs with invalid companyName', () => {
    fc.assert(
      fc.property(validB2BFormArb, invalidCompanyNameArb, (validForm, badName) => {
        const form = { ...validForm, companyName: badName }
        const result = validateB2BForm(form)

        expect(result.success).toBe(false)
        expect(result.errors.companyName).toBeDefined()
      }),
      { numRuns: 100 },
    )
  })
})
