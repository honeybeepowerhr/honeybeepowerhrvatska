'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Sun, HeartPulse, ShieldCheck, Flame } from 'lucide-react'
import { ComparisonTable } from './ComparisonTable'

export function WhyHBPSection() {
  const t = useTranslations('whyHbp')

  const ingredients = [
    {
      icon: Sun,
      title: t('reason1Title'),
      description: t('reason1Desc'),
      accentColor: 'from-amber-400 via-orange-500 to-yellow-500',
    },
    {
      icon: Flame,
      title: t('reason2Title'),
      description: t('reason2Desc'),
      accentColor: 'from-red-500 via-orange-500 to-amber-500',
    },
    {
      icon: ShieldCheck,
      title: t('reason3Title'),
      description: t('reason3Desc'),
      accentColor: 'from-red-600 via-red-500 to-orange-500',
    },
    {
      icon: HeartPulse,
      title: t('reason4Title'),
      description: t('reason4Desc'),
      accentColor: 'from-orange-500 via-amber-500 to-yellow-400',
    },
  ]

  return (
    <section className="relative py-16 md:py-24 bg-white border-b border-amber-100 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
            {t('badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 font-heading">
            {t('title')}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg font-sans font-medium">
            {t('subtitle')}
          </p>
        </div>

        {/* 4 Ingredient Feature Cards with 3D Hexagon Icon Frames */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ingredients.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="relative group bg-white p-6 rounded-3xl border border-orange-200/70 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* 3D Hexagon Icon Frame */}
                <div className={`w-16 h-16 clip-hexagon bg-gradient-to-br ${item.accentColor} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 font-heading">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans font-medium">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto">
          <ComparisonTable />
        </div>
      </div>
    </section>
  )
}
