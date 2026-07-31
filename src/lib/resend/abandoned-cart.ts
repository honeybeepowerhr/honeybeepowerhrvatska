/**
 * Abandoned Cart Email Scheduler Logic
 */

export interface AbandonedCartSession {
  id: string
  email: string
  items: Array<{ name: string; quantity: number; price: number }>
  createdAt: number
  scheduledEmails: Array<{
    id: string
    step: 1 | 2
    scheduledTime: number
    status: 'pending' | 'sent' | 'cancelled'
  }>
  status: 'active' | 'completed' | 'cancelled'
}

export class AbandonedCartTracker {
  private sessions = new Map<string, AbandonedCartSession>()

  /**
   * Registers a checkout attempt for abandoned cart recovery.
   * Schedules:
   * - Email 1: 1 hour (3,600,000 ms) after registration
   * - Email 2: 24 hours (86,400,000 ms) after Email 1 (total 25 hours / 90,000,000 ms)
   */
  public registerCheckout(
    id: string,
    email: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    now: number = Date.now(),
  ): AbandonedCartSession {
    const emailKey = email.trim().toLowerCase()

    // If an active session exists for this email, cancel previous scheduled emails first
    this.cancelScheduledEmailsForEmail(emailKey)

    const session: AbandonedCartSession = {
      id,
      email: emailKey,
      items,
      createdAt: now,
      status: 'active',
      scheduledEmails: [
        {
          id: `ac_1_${id}`,
          step: 1,
          scheduledTime: now + 3600 * 1000, // 1h
          status: 'pending',
        },
        {
          id: `ac_2_${id}`,
          step: 2,
          scheduledTime: now + (3600 + 86400) * 1000, // 24h after email 1 (25h total)
          status: 'pending',
        },
      ],
    }

    this.sessions.set(id, session)
    return session
  }

  /**
   * WHEN an order is completed, cancel all scheduled abandoned cart emails for this customer.
   */
  public cancelScheduledEmailsForEmail(email: string): number {
    const emailKey = email.trim().toLowerCase()
    let cancelledCount = 0

    for (const session of this.sessions.values()) {
      if (session.email === emailKey && session.status === 'active') {
        session.status = 'cancelled'
        for (const emailItem of session.scheduledEmails) {
          if (emailItem.status === 'pending') {
            emailItem.status = 'cancelled'
            cancelledCount++
          }
        }
      }
    }

    return cancelledCount
  }

  /**
   * Returns active pending scheduled emails at a given timestamp.
   */
  public getPendingEmailsDueAt(currentTime: number): Array<{
    sessionId: string
    email: string
    step: 1 | 2
    emailId: string
  }> {
    const due: Array<{
      sessionId: string
      email: string
      step: 1 | 2
      emailId: string
    }> = []

    for (const session of this.sessions.values()) {
      if (session.status !== 'active') continue

      for (const item of session.scheduledEmails) {
        if (item.status === 'pending' && currentTime >= item.scheduledTime) {
          due.push({
            sessionId: session.id,
            email: session.email,
            step: item.step,
            emailId: item.id,
          })
        }
      }
    }

    return due
  }

  public getSession(id: string): AbandonedCartSession | undefined {
    return this.sessions.get(id)
  }

  public getSessionsByEmail(email: string): AbandonedCartSession[] {
    const emailKey = email.trim().toLowerCase()
    return Array.from(this.sessions.values()).filter((s) => s.email === emailKey)
  }

  public clear(): void {
    this.sessions.clear()
  }
}

export const globalAbandonedCartTracker = new AbandonedCartTracker()
