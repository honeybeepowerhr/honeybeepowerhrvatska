// ============================================================
// Checkout schema — manual validation (zod not installed)
// ============================================================

import type { PaymentMethod, DeliveryMethod, CheckoutFormValues } from '@/types'

// ----------------------------------------------------------
// Validation error shape
// ----------------------------------------------------------

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormValues, string>>

// ----------------------------------------------------------
// Allowed enum values
// ----------------------------------------------------------

export const PAYMENT_METHODS: PaymentMethod[] = [
  'card',
  'cod',
  'bank_transfer',
  'google_pay',
  'apple_pay',
]

export const DELIVERY_METHODS: DeliveryMethod[] = [
  'hp_express',
  'overseas',
  'gls',
  'pickup',
]

// ----------------------------------------------------------
// Email regex (RFC-5322 simplified)
// ----------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ----------------------------------------------------------
// ISO-3166 alpha-2 — 2 uppercase letters
// ----------------------------------------------------------

const COUNTRY_RE = /^[A-Z]{2}$/

// ----------------------------------------------------------
// Promo codes
// ----------------------------------------------------------

export interface PromoResult {
  valid: boolean
  discountPercent: number
  label: string
}

const PROMO_CODES: Record<string, PromoResult> = {
  WELCOME10: { valid: true, discountPercent: 10, label: '-10%' },
}

export function validatePromoCode(code: string): PromoResult {
  const upper = code.trim().toUpperCase()
  return PROMO_CODES[upper] ?? { valid: false, discountPercent: 0, label: '' }
}

// ----------------------------------------------------------
// Main validation function
// ----------------------------------------------------------

export function validateCheckoutForm(
  values: Partial<CheckoutFormValues>
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {}

  // fullName — required, min 2
  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = 'Ime i prezime moraju imati najmanje 2 znaka.'
  }

  // email — required, valid format
  if (!values.email || !EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Unesite valjanu e-mail adresu.'
  }

  // phone — optional, but if provided at least 7 digits
  if (values.phone && values.phone.trim().length > 0) {
    const digits = values.phone.replace(/\D/g, '')
    if (digits.length < 7) {
      errors.phone = 'Telefonski broj mora imati najmanje 7 znamenki.'
    }
  }

  // address — required, min 5
  if (!values.address || values.address.trim().length < 5) {
    errors.address = 'Adresa mora imati najmanje 5 znakova.'
  }

  // city — required, min 2
  if (!values.city || values.city.trim().length < 2) {
    errors.city = 'Grad mora imati najmanje 2 znaka.'
  }

  // postalCode — required, min 4
  if (!values.postalCode || values.postalCode.trim().length < 4) {
    errors.postalCode = 'Poštanski broj mora imati najmanje 4 znaka.'
  }

  // country — required, exactly 2 uppercase letters (ISO-3166)
  if (!values.country || !COUNTRY_RE.test(values.country.trim().toUpperCase())) {
    errors.country = 'Odaberite državu (2-slovna kratica, npr. HR).'
  }

  // paymentMethod — required, must be one of enum
  if (!values.paymentMethod || !PAYMENT_METHODS.includes(values.paymentMethod)) {
    errors.paymentMethod = 'Odaberite metodu plaćanja.'
  }

  // deliveryMethod — required, must be one of enum
  if (!values.deliveryMethod || !DELIVERY_METHODS.includes(values.deliveryMethod)) {
    errors.deliveryMethod = 'Odaberite metodu dostave.'
  }

  // notes — optional, no validation beyond type
  // promoCode — optional, validated separately via validatePromoCode
  // isGuestCheckout — boolean with default true, no validation needed

  return errors
}

// ----------------------------------------------------------
// Default values
// ----------------------------------------------------------

export const defaultCheckoutValues: CheckoutFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'HR',
  paymentMethod: 'card',
  deliveryMethod: 'hp_express',
  promoCode: '',
  isGuestCheckout: true,
  notes: '',
}

// ----------------------------------------------------------
// Delivery cost lookup (in cents)
// ----------------------------------------------------------

export const DELIVERY_COSTS: Record<DeliveryMethod, number> = {
  hp_express: 499,
  overseas: 599,
  gls: 449,
  pickup: 0,
}

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  hp_express: 'HP Express',
  overseas: 'Overseas',
  gls: 'GLS',
  pickup: 'Preuzimanje u Našicama',
}
