// Feature: honey-bee-power-webshop, Property 13: Abandoned Cart Email Scheduling Logic
// Validates: Requirements 14.1, 14.3

import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { AbandonedCartTracker } from '@/lib/resend/abandoned-cart'

const validEmailArb = fc
  .tuple(
    fc.stringMatching(/^[a-z]{3,8}$/),
    fc.stringMatching(/^[a-z]{3,8}$/),
    fc.stringMatching(/^[a-z]{2,4}$/),
  )
  .map(([user, domain, tld]) => `${user}@${domain}.${tld}`)

const checkoutIdArb = fc.stringMatching(/^[a-z0-9_-]{5,15}$/)

describe('Property 13: Abandoned Cart Email Scheduling Logic', () => {
  let tracker: AbandonedCartTracker

  beforeEach(() => {
    tracker = new AbandonedCartTracker()
  })

  /**
   * Property: Registering a checkout session MUST schedule Email 1 at +1 hour (3,600s)
   * and Email 2 at +25 hours (90,000s).
   *
   * Validates: Requirement 14.1
   */
  it('schedules Email 1 at 1h and Email 2 at 25h total from registration', () => {
    fc.assert(
      fc.property(checkoutIdArb, validEmailArb, fc.date(), (id, email, date) => {
        const now = date.getTime()
        const session = tracker.registerCheckout(id, email, [], now)

        expect(session.scheduledEmails).toHaveLength(2)

        const email1 = session.scheduledEmails.find((e) => e.step === 1)
        const email2 = session.scheduledEmails.find((e) => e.step === 2)

        expect(email1?.scheduledTime).toBe(now + 3600 * 1000)
        expect(email2?.scheduledTime).toBe(now + (3600 + 86400) * 1000)
        expect(email1?.status).toBe('pending')
        expect(email2?.status).toBe('pending')
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property: WHEN an order is completed, all pending scheduled emails for that email address MUST be cancelled.
   *
   * Validates: Requirement 14.3
   */
  it('cancels all pending scheduled emails when order is completed', () => {
    fc.assert(
      fc.property(checkoutIdArb, validEmailArb, fc.date(), (id, email, date) => {
        const now = date.getTime()
        const session = tracker.registerCheckout(id, email, [], now)

        expect(session.status).toBe('active')
        expect(session.scheduledEmails.every((e) => e.status === 'pending')).toBe(true)

        const cancelledCount = tracker.cancelScheduledEmailsForEmail(email)

        expect(cancelledCount).toBe(2)
        expect(session.status).toBe('cancelled')
        expect(session.scheduledEmails.every((e) => e.status === 'cancelled')).toBe(true)

        // Verifies no pending emails are returned after cancellation
        const pendingAfterCancel = tracker.getPendingEmailsDueAt(now + 100000000)
        expect(pendingAfterCancel).toHaveLength(0)
      }),
      { numRuns: 100 },
    )
  })
})
