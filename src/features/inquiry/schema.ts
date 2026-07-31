// ============================================================
// Inquiry schema — manual validation (mirrors checkout schema,
// minus payment method, promo code, and delivery method — no
// payment happens here, delivery is arranged personally)
// ============================================================

import type { InquiryFormValues } from '@/types'

export type InquiryFieldErrors = Partial<Record<keyof InquiryFormValues, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COUNTRY_RE = /^[A-Z]{2}$/

export function validateInquiryForm(
  values: Partial<InquiryFormValues>
): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {}

  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = 'Ime i prezime moraju imati najmanje 2 znaka.'
  }

  if (!values.email || !EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Unesite valjanu e-mail adresu.'
  }

  if (values.phone && values.phone.trim().length > 0) {
    const digits = values.phone.replace(/\D/g, '')
    if (digits.length < 7) {
      errors.phone = 'Telefonski broj mora imati najmanje 7 znamenki.'
    }
  }

  if (!values.address || values.address.trim().length < 5) {
    errors.address = 'Adresa mora imati najmanje 5 znakova.'
  }

  if (!values.city || values.city.trim().length < 2) {
    errors.city = 'Grad mora imati najmanje 2 znaka.'
  }

  if (!values.postalCode || values.postalCode.trim().length < 4) {
    errors.postalCode = 'Poštanski broj mora imati najmanje 4 znaka.'
  }

  if (!values.country || !COUNTRY_RE.test(values.country.trim().toUpperCase())) {
    errors.country = 'Odaberite državu (2-slovna kratica, npr. HR).'
  }

  return errors
}

export const defaultInquiryValues: InquiryFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'HR',
  notes: '',
}
