import { z } from 'zod'

export const b2bSchema = z.object({
  companyName: z.string().trim().min(2, 'Naziv tvrtke/obrti mora imati najmanje 2 znaka.'),
  contactPerson: z.string().trim().min(2, 'Ime kontakt osobe mora imati najmanje 2 znaka.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email adresa je obavezna.')
    .email('Molimo unesite ispravnu email adresu (npr. info@tvrtka.hr).'),
  phone: z.string().trim().min(6, 'Telefonski broj mora imati najmanje 6 znamenki.'),
  cooperationType: z.enum(['distributer', 'maloprodaja', 'klub', 'teretana', 'ostalo'], {
    required_error: 'Odaberite vrstu suradnje.',
  }),
  message: z.string().trim().min(10, 'Poruka mora imati najmanje 10 znakova.'),
})

export type B2BFormValues = z.infer<typeof b2bSchema>

export interface B2BFormErrors {
  companyName?: string
  contactPerson?: string
  email?: string
  phone?: string
  cooperationType?: string
  message?: string
}

export function validateB2BForm(input: unknown): {
  success: boolean
  data?: B2BFormValues
  errors: B2BFormErrors
} {
  const result = b2bSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data, errors: {} }
  }

  const errors: B2BFormErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof B2BFormErrors
    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false, errors }
}
