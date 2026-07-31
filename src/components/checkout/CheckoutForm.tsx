'use client'

// ============================================================
// CheckoutForm — guest checkout, manual validation, WCAG
// ============================================================

import { useState, useId, useCallback, type ChangeEvent, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  validateCheckoutForm,
  validatePromoCode,
  defaultCheckoutValues,
  DELIVERY_COSTS,
  type CheckoutFieldErrors,
} from '@/features/checkout/schema'
import type { CheckoutFormValues, PaymentMethod, DeliveryMethod } from '@/types'

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

function formatEur(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

// ----------------------------------------------------------
// Field wrapper — label + input + error message
// ----------------------------------------------------------

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ id, label, required = false, error, children }: FieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-charcoal">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-500 ml-0.5">
            *
          </span>
        )}
      </Label>
      {/* Clone child to inject aria-describedby when there's an error */}
      <div>
        {/* We wrap children so the aria attributes work regardless of element */}
        <div
          data-error={error ? 'true' : undefined}
          id={`${id}-wrapper`}
          className="contents"
        >
          {children}
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="text-xs text-red-600 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

// ----------------------------------------------------------
// Radio option component
// ----------------------------------------------------------

interface RadioOptionProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  sublabel?: string
  price?: number
}

function RadioOption({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  sublabel,
  price,
}: RadioOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors',
        checked
          ? 'border-amber-500 bg-amber-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="accent-amber-500 w-4 h-4 shrink-0"
        />
        <div>
          <span className="text-sm font-medium text-charcoal">{label}</span>
          {sublabel && (
            <span className="block text-xs text-gray-500 mt-0.5">{sublabel}</span>
          )}
        </div>
      </div>
      {price !== undefined && (
        <span className="text-sm font-semibold text-charcoal shrink-0">
          {price === 0 ? 'Besplatno' : formatEur(price)}
        </span>
      )}
    </label>
  )
}

// ----------------------------------------------------------
// Section wrapper
// ----------------------------------------------------------

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-base font-semibold text-charcoal mb-4 font-heading uppercase tracking-wide">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

// ----------------------------------------------------------
// Main CheckoutForm
// ----------------------------------------------------------

interface CheckoutFormProps {
  onSubmit?: (values: CheckoutFormValues) => void | Promise<void>
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const uid = useId()
  const id = (field: string) => `${uid}-${field}`

  const [values, setValues] = useState<CheckoutFormValues>(defaultCheckoutValues)
  const [errors, setErrors] = useState<CheckoutFieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({})
  const [promoStatus, setPromoStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [promoLabel, setPromoLabel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // -- Field change helpers --

  const handleChange = useCallback(
    (field: keyof CheckoutFormValues) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const val = e.target.value
        setValues((prev) => ({ ...prev, [field]: val }))
        setTouched((prev) => ({ ...prev, [field]: true }))
        // Clear error on change
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      },
    []
  )

  const handleRadioChange = useCallback(
    (field: 'paymentMethod' | 'deliveryMethod') => (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value as PaymentMethod & DeliveryMethod }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    },
    []
  )

  // -- Promo code real-time validation --

  const handlePromoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value
    setValues((prev) => ({ ...prev, promoCode: code }))

    if (!code.trim()) {
      setPromoStatus('idle')
      setPromoLabel('')
      return
    }

    const result = validatePromoCode(code)
    if (result.valid) {
      setPromoStatus('valid')
      setPromoLabel(result.label)
    } else {
      setPromoStatus('invalid')
      setPromoLabel('')
    }
  }, [])

  // -- Submit --

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const newErrors = validateCheckoutForm(values)

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        // Focus first error field
        const firstKey = Object.keys(newErrors)[0]
        const el = document.getElementById(id(firstKey))
        el?.focus()
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit?.(values)
        setSubmitted(true)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit, id]
  )

  // -- Delivery cost for currently selected method --
  const deliveryCost = DELIVERY_COSTS[values.deliveryMethod]

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <p className="text-2xl mb-2">✅</p>
        <h2 className="text-xl font-semibold text-green-800 mb-1">Narudžba zaprimljena!</h2>
        <p className="text-green-700 text-sm">
          Potvrda je poslana na <strong>{values.email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Forma za narudžbu"
      className="space-y-8"
    >
      {/* ── 1. Osobni podaci ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <Section title="Osobni podaci">
          {/* fullName */}
          <Field
            id={id('fullName')}
            label="Ime i prezime"
            required
            error={errors.fullName}
          >
            <Input
              id={id('fullName')}
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Ana Horvat"
              value={values.fullName}
              onChange={handleChange('fullName')}
              aria-required="true"
              aria-describedby={errors.fullName ? `${id('fullName')}-error` : undefined}
              aria-invalid={!!errors.fullName}
              className={cn(errors.fullName && 'border-red-400 focus-visible:ring-red-400')}
            />
          </Field>

          {/* email */}
          <Field id={id('email')} label="E-mail" required error={errors.email}>
            <Input
              id={id('email')}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ana@example.com"
              value={values.email}
              onChange={handleChange('email')}
              aria-required="true"
              aria-describedby={errors.email ? `${id('email')}-error` : undefined}
              aria-invalid={!!errors.email}
              className={cn(errors.email && 'border-red-400 focus-visible:ring-red-400')}
            />
          </Field>

          {/* phone (optional) */}
          <Field id={id('phone')} label="Telefon (nije obavezno)" error={errors.phone}>
            <Input
              id={id('phone')}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+385 91 234 5678"
              value={values.phone ?? ''}
              onChange={handleChange('phone')}
              aria-describedby={errors.phone ? `${id('phone')}-error` : undefined}
              aria-invalid={!!errors.phone}
              className={cn(errors.phone && 'border-red-400 focus-visible:ring-red-400')}
            />
          </Field>
        </Section>
      </div>

      {/* ── 2. Dostava — adresa ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <Section title="Adresa dostave">
          {/* address */}
          <Field id={id('address')} label="Ulica i kućni broj" required error={errors.address}>
            <Input
              id={id('address')}
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="Ilica 1"
              value={values.address}
              onChange={handleChange('address')}
              aria-required="true"
              aria-describedby={errors.address ? `${id('address')}-error` : undefined}
              aria-invalid={!!errors.address}
              className={cn(errors.address && 'border-red-400 focus-visible:ring-red-400')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* city */}
            <Field id={id('city')} label="Grad" required error={errors.city}>
              <Input
                id={id('city')}
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="Zagreb"
                value={values.city}
                onChange={handleChange('city')}
                aria-required="true"
                aria-describedby={errors.city ? `${id('city')}-error` : undefined}
                aria-invalid={!!errors.city}
                className={cn(errors.city && 'border-red-400 focus-visible:ring-red-400')}
              />
            </Field>

            {/* postalCode */}
            <Field id={id('postalCode')} label="Poštanski broj" required error={errors.postalCode}>
              <Input
                id={id('postalCode')}
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                placeholder="10000"
                value={values.postalCode}
                onChange={handleChange('postalCode')}
                aria-required="true"
                aria-describedby={
                  errors.postalCode ? `${id('postalCode')}-error` : undefined
                }
                aria-invalid={!!errors.postalCode}
                className={cn(
                  errors.postalCode && 'border-red-400 focus-visible:ring-red-400'
                )}
              />
            </Field>
          </div>

          {/* country */}
          <Field id={id('country')} label="Država" required error={errors.country}>
            <select
              id={id('country')}
              name="country"
              autoComplete="country"
              value={values.country}
              onChange={handleChange('country')}
              aria-required="true"
              aria-describedby={errors.country ? `${id('country')}-error` : undefined}
              aria-invalid={!!errors.country}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                errors.country && 'border-red-400 focus-visible:ring-red-400'
              )}
            >
              <option value="HR">🇭🇷 Hrvatska</option>
              <option value="SI">🇸🇮 Slovenija</option>
              <option value="BA">🇧🇦 Bosna i Hercegovina</option>
              <option value="RS">🇷🇸 Srbija</option>
              <option value="AT">🇦🇹 Austrija</option>
              <option value="DE">🇩🇪 Njemačka</option>
              <option value="IT">🇮🇹 Italija</option>
              <option value="HU">🇭🇺 Mađarska</option>
              <option value="SK">🇸🇰 Slovačka</option>
              <option value="CZ">🇨🇿 Češka</option>
            </select>
          </Field>
        </Section>
      </div>

      {/* ── 3. Metoda dostave ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Section title="Metoda dostave">
          {errors.deliveryMethod && (
            <p id={`${id('deliveryMethod')}-error`} role="alert" className="text-xs text-red-600 -mt-2">
              {errors.deliveryMethod}
            </p>
          )}
          <div
            role="radiogroup"
            aria-required="true"
            aria-label="Odabir metode dostave"
            aria-describedby={
              errors.deliveryMethod ? `${id('deliveryMethod')}-error` : undefined
            }
            className="space-y-2"
          >
            <RadioOption
              id={id('delivery-hp_express')}
              name="deliveryMethod"
              value="hp_express"
              checked={values.deliveryMethod === 'hp_express'}
              onChange={handleRadioChange('deliveryMethod')}
              label="HP Express"
              sublabel="Dostava 1–2 radna dana (HP)"
              price={DELIVERY_COSTS.hp_express}
            />
            <RadioOption
              id={id('delivery-gls')}
              name="deliveryMethod"
              value="gls"
              checked={values.deliveryMethod === 'gls'}
              onChange={handleRadioChange('deliveryMethod')}
              label="GLS"
              sublabel="Dostava 1–3 radna dana"
              price={DELIVERY_COSTS.gls}
            />
            <RadioOption
              id={id('delivery-overseas')}
              name="deliveryMethod"
              value="overseas"
              checked={values.deliveryMethod === 'overseas'}
              onChange={handleRadioChange('deliveryMethod')}
              label="Overseas"
              sublabel="Međunarodna dostava 3–7 radnih dana"
              price={DELIVERY_COSTS.overseas}
            />
            <RadioOption
              id={id('delivery-pickup')}
              name="deliveryMethod"
              value="pickup"
              checked={values.deliveryMethod === 'pickup'}
              onChange={handleRadioChange('deliveryMethod')}
              label="Preuzimanje u Našicama"
              sublabel="Osobno preuzimanje — Vladimira Nazora 14, Našice"
              price={DELIVERY_COSTS.pickup}
            />
          </div>
        </Section>
      </div>

      {/* ── 4. Metoda plaćanja ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Section title="Metoda plaćanja">
          {errors.paymentMethod && (
            <p id={`${id('paymentMethod')}-error`} role="alert" className="text-xs text-red-600 -mt-2">
              {errors.paymentMethod}
            </p>
          )}
          <div
            role="radiogroup"
            aria-required="true"
            aria-label="Odabir metode plaćanja"
            aria-describedby={
              errors.paymentMethod ? `${id('paymentMethod')}-error` : undefined
            }
            className="space-y-2"
          >
            <RadioOption
              id={id('payment-card')}
              name="paymentMethod"
              value="card"
              checked={values.paymentMethod === 'card'}
              onChange={handleRadioChange('paymentMethod')}
              label="Kartica"
              sublabel="Visa / Mastercard — sigurno plaćanje"
            />
            <RadioOption
              id={id('payment-cod')}
              name="paymentMethod"
              value="cod"
              checked={values.paymentMethod === 'cod'}
              onChange={handleRadioChange('paymentMethod')}
              label="Pouzeće"
              sublabel="Platite kuriru pri preuzimanju"
            />
            <RadioOption
              id={id('payment-google_pay')}
              name="paymentMethod"
              value="google_pay"
              checked={values.paymentMethod === 'google_pay'}
              onChange={handleRadioChange('paymentMethod')}
              label="Google Pay"
              sublabel="Brzo i sigurno plaćanje"
            />
            <RadioOption
              id={id('payment-apple_pay')}
              name="paymentMethod"
              value="apple_pay"
              checked={values.paymentMethod === 'apple_pay'}
              onChange={handleRadioChange('paymentMethod')}
              label="Apple Pay"
              sublabel="Brzo i sigurno plaćanje"
            />
            <RadioOption
              id={id('payment-bank_transfer')}
              name="paymentMethod"
              value="bank_transfer"
              checked={values.paymentMethod === 'bank_transfer'}
              onChange={handleRadioChange('paymentMethod')}
              label="Bankovni transfer"
              sublabel="IBAN plaćanje — obrada 1–2 radna dana"
            />
          </div>
        </Section>
      </div>

      {/* ── 5. Promo kod ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Section title="Promo kod">
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <Input
                id={id('promoCode')}
                name="promoCode"
                type="text"
                placeholder="npr. WELCOME10"
                value={values.promoCode ?? ''}
                onChange={handlePromoChange}
                aria-describedby={`${id('promoCode')}-status`}
                aria-label="Promo kod"
                className={cn(
                  promoStatus === 'valid' && 'border-green-400 focus-visible:ring-green-400',
                  promoStatus === 'invalid' && 'border-red-400 focus-visible:ring-red-400'
                )}
              />
              <p
                id={`${id('promoCode')}-status`}
                role="status"
                aria-live="polite"
                className={cn(
                  'text-xs mt-1.5 font-medium',
                  promoStatus === 'valid' && 'text-green-600',
                  promoStatus === 'invalid' && 'text-red-600',
                  promoStatus === 'idle' && 'text-gray-400'
                )}
              >
                {promoStatus === 'valid' && `✓ Promo kod je valjan — popust ${promoLabel}`}
                {promoStatus === 'invalid' && '✗ Promo kod nije valjan'}
                {promoStatus === 'idle' && 'Unesite promo kod ako ga imate'}
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* ── 6. Napomena (opcionalno) ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Section title="Napomena uz narudžbu">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={id('notes')} className="text-sm font-medium text-charcoal">
              Posebne napomene (nije obavezno)
            </Label>
            <textarea
              id={id('notes')}
              name="notes"
              rows={3}
              placeholder="Npr. 'Ostavite paket kod vrata'"
              value={values.notes ?? ''}
              onChange={handleChange('notes')}
              aria-label="Napomena uz narudžbu"
              className={cn(
                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50 resize-none'
              )}
            />
          </div>
        </Section>
      </div>

      {/* ── Delivery cost summary ── */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-center justify-between text-sm">
        <span className="text-charcoal">Odabrana dostava:</span>
        <span className="font-semibold text-charcoal">
          {deliveryCost === 0 ? 'Besplatno' : formatEur(deliveryCost)}
        </span>
      </div>

      {/* ── Submit ── */}
      <Button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        size="lg"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-base h-14 rounded-xl transition-colors focus-visible:ring-amber-500"
      >
        {isSubmitting ? 'Šaljem narudžbu…' : 'Naruči odmah'}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Slanjem narudžbe prihvaćate naše{' '}
        <a href="/uvjeti-koristenja" className="underline hover:text-amber-600">
          Uvjete korištenja
        </a>{' '}
        i{' '}
        <a href="/privatnost" className="underline hover:text-amber-600">
          Politiku privatnosti
        </a>
        .
      </p>
    </form>
  )
}
