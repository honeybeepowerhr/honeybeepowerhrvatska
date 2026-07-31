// Feature: honey-bee-power-webshop, Property 6: Newsletter Email Validation
// Validates: Requirements 8.7

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateNewsletterEmail } from '@/features/newsletter/schema'

/** Valid email arbitrary */
const validEmailArb = fc
  .tuple(
    fc.stringMatching(/^[a-z0-9]{3,10}$/),
    fc.stringMatching(/^[a-z0-9]{3,10}$/),
    fc.stringMatching(/^[a-z]{2,4}$/),
  )
  .map(([user, domain, tld]) => `${user}@${domain}.${tld}`)

/** Invalid email arbitrary */
const invalidEmailArb = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('plainaddress'),
  fc.constant('#@%^%#$@#$@#.com'),
  fc.constant('@domain.com'),
  fc.constant('Joe Smith <email@domain.com>'),
  fc.constant('email.domain.com'),
  fc.constant('email@domain@domain.com'),
)

describe('Property 6: Newsletter Email Validation', () => {
  /**
   * Property: Valid RFC 5322 emails MUST pass newsletter validation without error.
   *
   * Validates: Requirements 8.7
   */
  it('accepts valid email addresses', () => {
    fc.assert(
      fc.property(validEmailArb, (email) => {
        const result = validateNewsletterEmail(email)
        expect(result.success).toBe(true)
        expect(result.error).toBeUndefined()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: Malformed emails MUST fail validation and return a clear error.
   *
   * Validates: Requirements 8.7
   */
  it('rejects invalid email addresses', () => {
    fc.assert(
      fc.property(invalidEmailArb, (email) => {
        const result = validateNewsletterEmail(email)
        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
      }),
      { numRuns: 100 },
    )
  })
})
