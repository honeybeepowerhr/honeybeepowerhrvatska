import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Trophy, Quote } from 'lucide-react'

const ATHLETES = [
  {
    name: 'Marko Horvat',
    sport: 'Maraton & Cestovno trčanje',
    achievements: ['Prvak Hrvatske na maratonu 2024', '1. mjesto Zagreb Maraton 2024 (2:28:15)'],
    quote: 'Čista energija meda promijenila je moje pripreme. Nema više mučnina na dugim dužinama.',
    imageUrl: '/images/events/event-2.jpg',
  },
  {
    name: 'Elena Perić',
    sport: 'Cestovni & MTB Biciklizam',
    achievements: ['Šampionka Kupa Hrvatske 2024', 'Top 10 MTB TransAlp'],
    quote: 'Izotonik me drži hidriranom satima na usponima bez teškog osjećaja u trbuhu.',
    imageUrl: '/images/events/event-6.jpg',
  },
  {
    name: 'Ivan Kovač',
    sport: 'Trijatlon & Borilački Sportovi',
    achievements: ['KBK Impact Cup Šampion', 'Ironman Finisher (9:12:04)'],
    quote: 'Medni gelovi su obavezni dio moje energije i oporavka nakon svakog treninga.',
    imageUrl: '/images/events/event-4.jpg',
  },
]

export default function AthletesPage() {
  const t = useTranslations('athletesPage')

  return (
    <div className="py-12 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">{t('badge')}</span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-1">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ATHLETES.map((ath, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <Image
                    src={ath.imageUrl}
                    alt={ath.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {ath.sport}
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 mt-1">{ath.name}</h2>

                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('achievementsTitle')}</span>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1 pl-5 list-disc">
                      {ath.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 relative">
                  <Quote className="w-6 h-6 text-amber-300 absolute top-2 right-2 opacity-50" />
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    &ldquo;{ath.quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
