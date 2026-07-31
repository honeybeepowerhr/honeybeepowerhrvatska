import { z } from 'zod'

export const reviewSchema = z.object({
  productId: z.string().min(1, 'productId ne smije biti prazan.'),
  rating: z
    .number({ required_error: 'Molimo odaberite ocjenu.' })
    .int('Ocjena mora biti cijeli broj.')
    .min(1, 'Ocjena mora biti najmanje 1.')
    .max(5, 'Ocjena ne smije biti veća od 5.'),
  title: z.string().trim().min(3, 'Naslov mora imati najmanje 3 znaka.'),
  body: z.string().trim().min(10, 'Tekst recenzije mora imati najmanje 10 znakova.'),
  author: z.string().trim().min(2, 'Ime mora imati najmanje 2 znaka.'),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export interface ReviewFormErrors {
  productId?: string
  rating?: string
  title?: string
  body?: string
  author?: string
}

export function validateReview(input: unknown): {
  success: boolean
  data?: ReviewFormValues
  errors: ReviewFormErrors
} {
  const result = reviewSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data, errors: {} }
  }

  const errors: ReviewFormErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ReviewFormErrors
    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false, errors }
}
