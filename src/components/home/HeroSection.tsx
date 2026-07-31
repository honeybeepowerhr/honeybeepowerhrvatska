'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onOpenQuiz?: () => void
}

export function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-white py-12 md:py-24 border-b border-amber-100">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hexagon Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>{t('trustHoney')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.1] font-heading">
              {t('heading')}
            </h1>

            <p className="text-lg text-gray-700 max-w-2xl leading-relaxed font-sans font-medium">
              {t('subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold px-8 h-13 rounded-2xl text-base shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.03]"
              >
                <Link href="/proizvodi">
                  {t('ctaPrimary')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onOpenQuiz}
                className="border-2 border-orange-400 text-orange-950 hover:bg-orange-100/60 font-extrabold px-8 h-13 rounded-2xl text-base bg-white/80 backdrop-blur-sm"
              >
                {t('ctaSecondary')}
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="pt-8 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800 font-semibold">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>{t('trustHoney')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{t('trustNoSucralose')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>{t('trustFruit')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Image with 3D Hexagon Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-red-500/20 via-orange-400/20 to-amber-300/20 p-6 border-2 border-orange-300/60 shadow-2xl flex items-center justify-center backdrop-blur-sm">
              
              {/* Decorative Floating 3D Hexagon Badge */}
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 text-white flex flex-col items-center justify-center text-center clip-hexagon shadow-2xl p-1.5 transform rotate-12 animate-float-3d select-none">
                <span className="font-black text-xs sm:text-sm text-yellow-200 leading-none">100%</span>
                <span className="font-black text-[9px] sm:text-[11px] text-white leading-tight uppercase tracking-wide">
                  {t('badgeHoney').replace('100%', '').trim()}
                </span>
              </div>

              <Image
                src="/images/products/energygelmalina.png"
                alt="Honey Bee Power Energetski Gel Malina"
                width={600}
                height={600}
                priority
                className="w-full h-full object-contain drop-shadow-2xl p-2"
              />

              <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-orange-200 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-xs sm:text-sm shadow">
                  4.9★
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{t('athleteRating')}</div>
                  <div className="text-xs sm:text-sm font-extrabold text-gray-900">{t('reviewsCount')}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
