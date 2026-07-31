/**
 * Resend Email Service Client and Helpers
 */

export interface EmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // Development mode fallback when RESEND_API_KEY is not configured
    console.log(`[Resend Mock] Email sent to ${to}: "${subject}"`)
    return {
      success: true,
      id: `mock_resend_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Honey Bee Power <info@planetbio.hr>',
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return {
        success: false,
        error: err.message || `HTTP error ${response.status}`,
      }
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown network error',
    }
  }
}
