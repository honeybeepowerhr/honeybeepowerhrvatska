'use client'

import { useState, useId, useCallback, type ChangeEvent, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  validateInquiryForm,
  defaultInquiryValues,
  type InquiryFieldErrors,
} from '@/features/inquiry/schema'
import type { InquiryFormValues } from '@/types'

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
      <div>
        <div data-error={error ? 'true' : undefined} id={`${id}-wrapper`} className="contents">
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
// Main InquiryForm
// ----------------------------------------------------------

interface InquiryFormProps {
  onSubmit?: (values: InquiryFormValues) => void | Promise<void>
}

export default function InquiryForm({ onSubmit }: InquiryFormProps) {
  const t = useTranslations('checkout')

  const uid = useId()
  const id = (field: string) => `${uid}-${field}`

  const [values, setValues] = useState<InquiryFormValues>(defaultInquiryValues)
  const [errors, setErrors] = useState<InquiryFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = useCallback(
    (field: keyof InquiryFormValues) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const val = e.target.value
        setValues((prev) => ({ ...prev, [field]: val }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      },
    []
  )

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const newErrors = validateInquiryForm(values)

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        const firstKey = Object.keys(newErrors)[0]
        const el = document.getElementById(id(firstKey))
        el?.focus()
        return
      }

      setSubmitError(null)
      setIsSubmitting(true)
      try {
        await onSubmit?.(values)
        setSubmitted(true)
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Slanje upita nije uspjelo. Pokušajte ponovno.'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit, id]
  )

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <p className="text-2xl mb-2">✅</p>
        <h2 className="text-xl font-semibold text-green-800 mb-1">{t('successTitle')}</h2>
        <p className="text-green-700 text-sm">
          {t('successMessage', { email: values.email })}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={t('title')} className="space-y-8">
      {/* ── 1. Osobni podaci ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <Section title={t('personalData')}>
          <Field id={id('fullName')} label={t('fullName')} required error={errors.fullName}>
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

          <Field id={id('email')} label={t('email')} required error={errors.email}>
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

          <Field id={id('phone')} label={t('phone')} error={errors.phone}>
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

      {/* ── 2. Adresa dostave ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <Section title={t('shippingAddress')}>
          <Field id={id('address')} label={t('address')} required error={errors.address}>
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
            <Field id={id('city')} label={t('city')} required error={errors.city}>
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

            <Field id={id('postalCode')} label={t('postalCode')} required error={errors.postalCode}>
              <Input
                id={id('postalCode')}
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                placeholder="10000"
                value={values.postalCode}
                onChange={handleChange('postalCode')}
                aria-required="true"
                aria-describedby={errors.postalCode ? `${id('postalCode')}-error` : undefined}
                aria-invalid={!!errors.postalCode}
                className={cn(errors.postalCode && 'border-red-400 focus-visible:ring-red-400')}
              />
            </Field>
          </div>

          <Field id={id('country')} label={t('country')} required error={errors.country}>
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

      {/* ── 3. Napomena (opcionalno) ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Section title={t('notesTitle')}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={id('notes')} className="text-sm font-medium text-charcoal">
              {t('notesLabel')}
            </Label>
            <textarea
              id={id('notes')}
              name="notes"
              rows={3}
              placeholder="Npr. dodatna pitanja o proizvodima ili dostavi"
              value={values.notes ?? ''}
              onChange={handleChange('notes')}
              aria-label={t('notesTitle')}
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

      {/* ── Info banner ── */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-charcoal">
        {t('infoBanner')}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600 text-center">
          {submitError}
        </p>
      )}

      {/* ── Submit ── */}
      <Button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        size="lg"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-base h-14 rounded-xl transition-colors focus-visible:ring-amber-500"
      >
        {isSubmitting ? t('submittingBtn') : t('submitBtn')}
      </Button>

      <p className="text-center text-xs text-gray-400">
        {t('termsAccept')}
      </p>
    </form>
  )
}
