'use client'

import React, { useState } from 'react'
import { Building2, CheckCircle2, Send, ShieldCheck, Truck, Percent, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateB2BForm, type B2BFormErrors } from '@/features/b2b/schema'

export default function B2BPage() {
  const t = useTranslations('b2bPage')

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    cooperationType: 'maloprodaja',
    message: '',
  })

  const [errors, setErrors] = useState<B2BFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = validateB2BForm(formData)
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrors(data.errors || { companyName: 'Slanje nije uspjelo.' })
        return
      }

      setIsSuccess(true)
    } catch {
      setErrors({ companyName: 'Mrežna greška. Molimo pokušajte ponovno.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-sm font-bold">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefit1Title')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('benefit1Desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefit2Title')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('benefit2Desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefit3Title')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('benefit3Desc')}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{t('formTitle')}</h2>

          {isSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">{t('successTitle')}</h3>
                <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                  {t('successDesc')}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t('companyLabel')}</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="npr. Bio Sport d.o.o."
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && (
                  <p className="text-xs font-semibold text-red-600">{errors.companyName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">{t('contactLabel')}</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="npr. Marko Marković"
                    className={errors.contactPerson ? 'border-red-500' : ''}
                  />
                  {errors.contactPerson && (
                    <p className="text-xs font-semibold text-red-600">{errors.contactPerson}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="prodaja@tvrtka.hr"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs font-semibold text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneLabel')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+385 91 123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs font-semibold text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooperationType">{t('typeLabel')}</Label>
                  <select
                    id="cooperationType"
                    value={formData.cooperationType}
                    onChange={(e) => setFormData({ ...formData, cooperationType: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="maloprodaja">{t('typeRetail')}</option>
                    <option value="distributer">{t('typeDistributor')}</option>
                    <option value="klub">{t('typeClub')}</option>
                    <option value="teretana">{t('typeGym')}</option>
                    <option value="ostalo">{t('typeOther')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('messageLabel')}</Label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="..."
                  className={[
                    'w-full p-3 rounded-xl border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    errors.message ? 'border-red-500' : 'border-input',
                  ].join(' ')}
                />
                {errors.message && (
                  <p className="text-xs font-semibold text-red-600">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-base shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('submitBtn')}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
