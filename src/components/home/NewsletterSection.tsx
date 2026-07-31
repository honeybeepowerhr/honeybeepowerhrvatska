'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateNewsletterEmail } from '@/features/newsletter/schema'
import { HexagonGrid } from '@/components/ui/HexagonGrid'

export function NewsletterSection() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = validateNewsletterEmail(email)
    if (!validation.success) {
      setError(validation.error || 'Neispravna email adresa.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Došlo je do greške. Pokušajte ponovno.')
        return
      }

      setIsSuccess(true)
    } catch {
      setError('Mrežna greška. Provjerite vezu s internetom.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white overflow-hidden shadow-2xl">
      <HexagonGrid className="opacity-30" />

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 clip-hexagon bg-white/20 mb-4 backdrop-blur-md shadow-lg">
          <Mail className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading">
          {t('title')}
        </h2>

        <p className="text-yellow-100 text-base sm:text-lg mt-3 max-w-2xl mx-auto font-sans font-medium">
          {t('subtitle')}
        </p>

        {isSuccess ? (
          <div className="mt-8 p-6 bg-white/20 rounded-3xl border border-white/30 max-w-md mx-auto flex items-center justify-center gap-3 backdrop-blur-md shadow-xl">
            <CheckCircle2 className="w-7 h-7 text-yellow-300 flex-shrink-0" />
            <div className="text-left">
              <div className="font-extrabold text-lg">{t('success')}</div>
              <div className="text-xs text-yellow-100">
                {t('successDetail', { email })}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Input
                type="email"
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 placeholder:text-gray-400 h-13 rounded-2xl border-none focus-visible:ring-2 focus-visible:ring-amber-300 shadow-inner text-base"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold h-13 px-8 rounded-2xl shadow-xl flex-shrink-0 text-base transition-transform hover:scale-[1.02]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('submit')}
              </Button>
            </div>

            {error && (
              <p className="text-sm font-bold text-yellow-200 bg-black/30 py-2 px-4 rounded-xl text-left">
                {error}
              </p>
            )}

            <p className="text-xs text-yellow-100/90 font-medium">
              {t('privacy')}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
