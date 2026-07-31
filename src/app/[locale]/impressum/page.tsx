'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export default function ImpressumPage() {
  const t = useTranslations('legal')

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-3xl font-black text-gray-900">{t('impressumTitle')}</h1>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-sm text-gray-700">
          <div>
            <strong className="text-gray-900 block text-base">{t('companyName')}</strong>
            {t('companyNameVal')}
          </div>

          <div>
            <strong className="text-gray-900 block">{t('address')}</strong>
            {t('addressVal')}
          </div>

          <div>
            <strong className="text-gray-900 block">{t('contactDetails')}</strong>
            Email: info@planetbio.hr<br />
            Telefon: +385 977 097 962
          </div>

          <div>
            <strong className="text-gray-900 block">{t('idData')}</strong>
            OIB: 12345678901<br />
            MBS: 030123456<br />
            Trgovački sud u Osijeku
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold">
          {t('disclaimerNotice')}
        </div>
      </div>
    </div>
  )
}
