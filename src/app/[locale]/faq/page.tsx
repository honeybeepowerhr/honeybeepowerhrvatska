'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

const FAQS = [
  {
    q: 'Zašto je med bolji od kemijskih gelova?',
    a: 'Med pruža prirodnu kombinaciju glukoze i fruktoze koja omogucava maksimalnu apsorpciju energije bez teškog osjećaja i grčeva u želucu.',
  },
  {
    q: 'Sadrže li proizvodi umjetne zaslađivače poput sukraloze?',
    a: 'Apsolutno ne! Svi Honey Bee Power proizvodi su 100% prirodni, zaslađeni isključivo prirodnim cvjetnim medom.',
  },
  {
    q: 'Koliko traje dostava?',
    a: 'Uobičajeni rok dostave unutar Hrvatske je 1-3 radna dana.',
  },
  {
    q: 'Kako se koristi Honey Power Energy Gel?',
    a: 'Preporučujemo uzimanje 1 gela 15 minuta prije početka aktivnosti te po 1 gel svakih 30-45 minuta tijekom jakog napora.',
  },
]

export default function FAQPage() {
  const t = useTranslations('legal')

  return (
    <div className="py-12 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">{t('faqBadge')}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{t('faqTitle')}</h1>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <h2 className="font-bold text-gray-900 text-lg">{faq.q}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
