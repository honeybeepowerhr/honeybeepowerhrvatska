'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QUIZ_QUESTIONS, recommendProducts, type QuizRecommendation } from '@/features/quiz/engine'
import { useCartStore } from '@/features/cart/store'
import { REAL_PRODUCTS } from '@/lib/products-data'
import type { Locale } from '@/types'

interface QuizSectionProps {
  onClose?: () => void
}

export function QuizSection({ onClose }: QuizSectionProps) {
  const t = useTranslations('quiz')
  const locale = useLocale() as Locale
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [recommendations, setRecommendations] = useState<QuizRecommendation[] | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  const currentQuestion = QUIZ_QUESTIONS[currentStep]
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)

  const handleSelectOption = (questionId: string, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId }
    setAnswers(updated)

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const recs = recommendProducts(updated, locale, {
        energyGel: t('matchReasonEnergyGel'),
        isotonic: t('matchReasonIsotonic'),
      })
      setRecommendations(recs)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setRecommendations(null)
  }

  const handleAddToCart = (rec: QuizRecommendation) => {
    const fullProd = REAL_PRODUCTS.find((p) => p._id === rec.productId)
    const variant = fullProd ? fullProd.variants[0] : null

    addItem({
      productId: rec.productId,
      variantId: variant ? variant._key : `${rec.slug}-default`,
      name: rec.name,
      slug: rec.slug,
      variantLabel: variant ? `${variant.flavour} (${variant.size})` : 'Standard',
      unitPrice: rec.price,
      quantity: 1,
      imageSrc: rec.imageUrl,
    })
    openCart()
  }

  return (
    <section id="quiz-section" className="py-16 md:py-24 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 border-b border-amber-100 relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-2xl relative overflow-hidden">
          
          {/* Top Decorative Amber Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-heading">
              {t('heading')}
            </h2>
            <p className="text-gray-600 text-base font-sans font-medium">
              {t('subheading')}
            </p>
          </div>

          {/* Results Screen */}
          {recommendations ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-emerald-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {t('resultsReady')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommendations.map((rec) => {
                  const priceEur = (rec.price / 100).toFixed(2)
                  return (
                    <div
                      key={rec.productId}
                      className="bg-amber-50/50 rounded-3xl p-6 border border-amber-200 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square w-full mb-4 bg-white rounded-2xl p-4 overflow-hidden border border-amber-100 shadow-inner">
                          <Image
                            src={rec.imageUrl}
                            alt={rec.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-1 rounded-md">
                          {rec.category === 'energetski-gelovi' ? t('categoryEnergyGel') : t('categoryIsotonic')}
                        </span>
                        <h3 className="text-xl font-black text-gray-900 mt-2 font-heading">{rec.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed font-sans font-medium">{rec.matchReason}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between">
                        <div className="text-2xl font-black text-gray-900 font-heading">
                          {priceEur} €
                        </div>

                        <Button
                          onClick={() => handleAddToCart(rec)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-5 shadow-md active:scale-95 transition-transform"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t('addToCart')}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-amber-300 text-amber-900 hover:bg-amber-100 font-bold rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('resetQuiz')}
                </Button>
              </div>
            </div>
          ) : (
            /* Quiz Questions Step */
            <div className="space-y-6">
              {/* Progress Bar & Step Indicator */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-2">
                  <span>{t('questionOf', { step: currentStep + 1, total: QUIZ_QUESTIONS.length })}</span>
                  <span>{t('percentDone', { percent: progressPercent })}</span>
                </div>
                <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Title */}
              <div className="py-2">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-heading">
                  {t(`questions.${currentQuestion.id}.title`)}
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-sans">
                  {t(`questions.${currentQuestion.id}.subtitle`)}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100/60 text-amber-950 shadow-md'
                          : 'border-amber-200/80 bg-white hover:border-amber-400 hover:bg-amber-50 text-gray-800'
                      }`}
                    >
                      <span>{t(`questions.${currentQuestion.id}.options.${option.id}`)}</span>
                      <ArrowRight className="w-5 h-5 text-amber-500 opacity-60 group-hover:opacity-100 shrink-0 ml-2" />
                    </button>
                  )
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-amber-100">
                <Button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900 font-bold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('prevQuestion')}
                </Button>

                {onClose && (
                  <Button onClick={onClose} variant="ghost" className="text-gray-500 text-xs font-semibold">
                    {t('close')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
