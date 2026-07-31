'use client'

import React, { useState, useId } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReviewsTabProps {
  productId: string
  reviews?: Review[]
}

interface FormState {
  rating: number
  title: string
  body: string
  author: string
}

interface FormErrors {
  rating?: string
  title?: string
  body?: string
  author?: string
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (form.rating === 0) {
    errors.rating = 'Molimo odaberite ocjenu.'
  }
  if (form.title.trim().length < 3) {
    errors.title = 'Naslov mora imati najmanje 3 znaka.'
  }
  if (form.body.trim().length < 10) {
    errors.body = 'Tekst recenzije mora imati najmanje 10 znakova.'
  }
  if (form.author.trim().length < 2) {
    errors.author = 'Ime mora imati najmanje 2 znaka.'
  }

  return errors
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StarRatingDisplayProps {
  rating: number
  /** Total stars (default 5) */
  max?: number
  size?: 'sm' | 'md'
  label?: string
}

function StarRatingDisplay({ rating, max = 5, size = 'md', label }: StarRatingDisplayProps) {
  const px = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <span
      role="img"
      aria-label={label ?? `${rating} od ${max} zvjezdica`}
      className="inline-flex gap-0.5"
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(px, i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200')}
        />
      ))}
    </span>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  id: string
  error?: string
}

function StarRatingInput({ value, onChange, id, error }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <fieldset>
      <legend
        id={id}
        className={cn(
          'text-sm font-medium mb-1',
          error ? 'text-red-600' : 'text-gray-700',
        )}
      >
        Ocjena <span aria-hidden="true">*</span>
      </legend>

      <div
        role="radiogroup"
        aria-labelledby={id}
        aria-required="true"
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const star = i + 1
          const isActive = star <= (hovered || value)
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} ${star === 1 ? 'zvjezdica' : star < 5 ? 'zvjezdice' : 'zvjezdica'}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              className={cn(
                'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1',
              )}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  'w-8 h-8 transition-colors',
                  isActive ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-300',
                )}
              />
            </button>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}

// ---------------------------------------------------------------------------
// Rating filter bar
// ---------------------------------------------------------------------------

const ALL_STARS = [5, 4, 3, 2, 1] as const

interface RatingFilterProps {
  reviews: Review[]
  active: Set<number>
  onChange: (star: number) => void
}

function RatingFilter({ reviews, active, onChange }: RatingFilterProps) {
  const counts = ALL_STARS.reduce<Record<number, number>>(
    (acc, star) => {
      acc[star] = reviews.filter((r) => r.rating === star).length
      return acc
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  )

  return (
    <div
      role="group"
      aria-label="Filtriraj recenzije prema ocjeni"
      className="flex flex-wrap gap-2 mb-6"
    >
      {ALL_STARS.map((star) => {
        const checked = active.has(star)
        return (
          <button
            key={star}
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={`Prikaži recenzije s ${star} ${star === 1 ? 'zvjezdicom' : 'zvjezdice'} (${counts[star]})`}
            onClick={() => onChange(star)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1',
              checked
                ? 'bg-amber-400 text-white border-amber-400'
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400',
            )}
          >
            <Star
              aria-hidden="true"
              className={cn(
                'w-3.5 h-3.5',
                checked ? 'fill-white text-white' : 'fill-amber-400 text-amber-400',
              )}
            />
            {star}
            <span className="text-xs opacity-75">({counts[star]})</span>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const INITIAL_FORM: FormState = { rating: 0, title: '', body: '', author: '' }

export default function ReviewsTab({ productId, reviews = [] }: ReviewsTabProps) {
  // Filter state
  const [activeStars, setActiveStars] = useState<Set<number>>(new Set())

  // Form state
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  // Stable IDs for accessibility
  const ratingInputId = useId()
  const titleId = useId()
  const bodyId = useId()
  const authorId = useId()
  const formHeadingId = useId()

  // Approved reviews only
  const approvedReviews = reviews.filter((r) => r.status === 'approved')

  // Filtered list
  const visibleReviews =
    activeStars.size === 0
      ? approvedReviews
      : approvedReviews.filter((r) => activeStars.has(r.rating))

  // Derived average
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      : 0

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function toggleStar(star: number) {
    setActiveStars((prev) => {
      const next = new Set(prev)
      if (next.has(star)) {
        next.delete(star)
      } else {
        next.add(star)
      }
      return next
    })
  }

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const updated = { ...form, [key]: value }
    setForm(updated)

    if (touched[key]) {
      const errs = validate(updated)
      setErrors((prev) => ({ ...prev, [key]: errs[key] }))
    }
  }

  function handleBlur(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const errs = validate(form)
    setErrors((prev) => ({ ...prev, [key]: errs[key] }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ rating: true, title: true, body: true, author: true })
    const errs = validate(form)
    setErrors(errs)

    if (Object.keys(errs).length > 0) return

    setSubmitStatus('loading')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: form.rating,
          title: form.title.trim(),
          body: form.body.trim(),
          author: form.author.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      setSubmitStatus('success')
      setForm(INITIAL_FORM)
      setErrors({})
      setTouched({})
    } catch {
      setSubmitStatus('error')
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-10">
      {/* ── Summary ── */}
      {approvedReviews.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black text-charcoal">
            {averageRating.toFixed(1)}
          </span>
          <div>
            <StarRatingDisplay
              rating={Math.round(averageRating)}
              label={`Prosječna ocjena ${averageRating.toFixed(1)} od 5`}
            />
            <p className="text-sm text-gray-500 mt-0.5">
              {approvedReviews.length}{' '}
              {approvedReviews.length === 1 ? 'recenzija' : 'recenzija'}
            </p>
          </div>
        </div>
      )}

      {/* ── Filter ── */}
      {approvedReviews.length > 0 && (
        <RatingFilter
          reviews={approvedReviews}
          active={activeStars}
          onChange={toggleStar}
        />
      )}

      {/* ── Review list ── */}
      {approvedReviews.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Budi prvi koji ocijeni ovaj proizvod
        </p>
      ) : visibleReviews.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Nema recenzija za odabrani filter.
        </p>
      ) : (
        <ul className="space-y-6" aria-label="Recenzije kupaca">
          {visibleReviews.map((review) => (
            <li
              key={review._id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-semibold text-charcoal">{review.author}</span>
                  <time
                    dateTime={review.createdAt}
                    className="ml-3 text-xs text-gray-400"
                  >
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <StarRatingDisplay
                  rating={review.rating}
                  size="sm"
                  label={`Ocjena: ${review.rating} od 5`}
                />
              </div>
              <p className="font-medium text-sm text-charcoal mb-1">{review.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
            </li>
          ))}
        </ul>
      )}

      {/* ── Write a review form ── */}
      <section aria-labelledby={formHeadingId} className="border-t border-gray-200 pt-8">
        <h3
          id={formHeadingId}
          className="font-heading font-bold text-xl text-charcoal mb-6"
        >
          Napiši recenziju
        </h3>

        {submitStatus === 'success' ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl bg-green-50 border border-green-200 p-5 text-green-800 text-sm"
          >
            Hvala na recenziji! Bit će objavljena nakon provjere.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Rating */}
            <div>
              <StarRatingInput
                id={ratingInputId}
                value={form.rating}
                onChange={(r) => handleField('rating', r)}
                error={errors.rating}
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor={titleId}>
                Naslov recenzije <span aria-hidden="true">*</span>
              </Label>
              <Input
                id={titleId}
                type="text"
                value={form.title}
                onChange={(e) => handleField('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                aria-describedby={errors.title ? `${titleId}-error` : undefined}
                aria-invalid={!!errors.title}
                placeholder="Kratki sažetak vašeg iskustva"
                minLength={3}
              />
              {errors.title && (
                <p id={`${titleId}-error`} role="alert" className="text-xs text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="space-y-1">
              <Label htmlFor={bodyId}>
                Vaša recenzija <span aria-hidden="true">*</span>
              </Label>
              <textarea
                id={bodyId}
                value={form.body}
                onChange={(e) => handleField('body', e.target.value)}
                onBlur={() => handleBlur('body')}
                aria-describedby={errors.body ? `${bodyId}-error` : undefined}
                aria-invalid={!!errors.body}
                rows={4}
                minLength={10}
                placeholder="Podijelite detaljno iskustvo s ovim proizvodom..."
                className={cn(
                  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'ring-offset-background placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[96px]',
                )}
              />
              {errors.body && (
                <p id={`${bodyId}-error`} role="alert" className="text-xs text-red-600">
                  {errors.body}
                </p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-1">
              <Label htmlFor={authorId}>
                Vaše ime <span aria-hidden="true">*</span>
              </Label>
              <Input
                id={authorId}
                type="text"
                value={form.author}
                onChange={(e) => handleField('author', e.target.value)}
                onBlur={() => handleBlur('author')}
                aria-describedby={errors.author ? `${authorId}-error` : undefined}
                aria-invalid={!!errors.author}
                placeholder="npr. Ana K."
                minLength={2}
              />
              {errors.author && (
                <p id={`${authorId}-error`} role="alert" className="text-xs text-red-600">
                  {errors.author}
                </p>
              )}
            </div>

            {/* Submit error */}
            {submitStatus === 'error' && (
              <p role="alert" className="text-sm text-red-600">
                Došlo je do greške. Molimo pokušajte ponovo.
              </p>
            )}

            <Button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
            >
              {submitStatus === 'loading' ? 'Šalje se…' : 'Pošalji recenziju'}
            </Button>
          </form>
        )}
      </section>
    </div>
  )
}
