'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'
import { InstagramFeed } from './InstagramFeed'

const TESTIMONIALS = [
  {
    name: 'Marko Horvat',
    sport: 'Maratonac (PB: 2h 28min)',
    quote: 'Honey Bee Power gelovi su prvi gelovi u 10 godina trčanja od kojih nisam imao želučane grčeve na 30. kilometru.',
    rating: 5,
    avatar: '/images/events/event-2.jpg',
  },
  {
    name: 'Elena Perić',
    sport: 'Cestovna biciklistica',
    quote: 'Izotonični napitak od meda daje nevjerojatno osvježenje. Nema umjetnog slatkog okusa u ustima nakon vožnje.',
    rating: 5,
    avatar: '/images/events/event-6.jpg',
  },
  {
    name: 'Ivan Kovač',
    sport: 'Crossfit & MMA natjecatelj',
    quote: 'Energetski gelovi s medom su top razina. Savršena energija i prirodan sastav bez umjetnih aditiva.',
    rating: 5,
    avatar: '/images/events/event-7.jpg',
  },
]

const PARTNERS = [
  'Zagrebački Maraton',
  'BK Našice',
  'Triatlon Klub Swibir',
  'Hrvatski Atletski Savez',
]

export function SocialProofSection() {
  const t = useTranslations('socialProof')

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        
        {/* Partner Logos */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            {t('partnersBadge')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
            {PARTNERS.map((name, i) => (
              <span key={i} className="text-lg sm:text-xl font-black text-gray-700 tracking-wider">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">
              {t('badge')}
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              {t('title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-amber-50/40 p-6 rounded-2xl border border-amber-100 flex flex-col justify-between relative shadow-sm"
              >
                <Quote className="w-8 h-8 text-amber-300 absolute top-4 right-4" />
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-amber-200/50">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border border-amber-300"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-amber-700 font-medium">{t.sport}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Feed */}
        <InstagramFeed />
      </div>
    </section>
  )
}
