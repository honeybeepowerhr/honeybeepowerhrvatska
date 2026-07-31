import { z } from 'zod'

/**
 * RFC 5322 compliant newsletter email schema
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email adresa je obavezna.')
    .email('Molimo unesite ispravnu email adresu (npr. ime@domena.hr).'),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>

export function validateNewsletterEmail(email: string): {
  success: boolean
  error?: string
} {
  const result = newsletterSchema.safeParse({ email })
  if (result.success) {
    return { success: true }
  }
  return {
    success: false,
    error: result.error.issues[0]?.message || 'Neispravan email.',
  }
}
