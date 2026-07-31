import { REAL_PRODUCTS } from '@/lib/products-data'
import type { Locale } from '@/types'

export interface QuizOption {
  id: string
  tags: string[]
}

export interface QuizQuestion {
  id: string
  options: QuizOption[]
}

export interface QuizRecommendation {
  productId: string
  slug: string
  name: string
  category: string
  price: number // in cents
  matchReason: string
  imageUrl: string
}

export interface QuizMatchReasons {
  energyGel: string
  isotonic: string
}

/**
 * Question/option ids only — display text (title, subtitle, option labels)
 * lives in the `quiz.questions.<id>` messages so the quiz translates via next-intl.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'activity',
    options: [
      { id: 'running', tags: ['energy-gel', 'isotonic'] },
      { id: 'cycling', tags: ['energy-gel', 'isotonic'] },
      { id: 'hiking', tags: ['energy-gel', 'isotonic'] },
      { id: 'fitness', tags: ['isotonic', 'energy-gel'] },
    ],
  },
  {
    id: 'duration',
    options: [
      { id: 'short', tags: ['energy-gel'] },
      { id: 'medium', tags: ['energy-gel', 'lemon', 'orange'] },
      { id: 'long', tags: ['isotonic', 'energy-gel'] },
      { id: 'ultra', tags: ['isotonic', 'energy-gel'] },
    ],
  },
  {
    id: 'goal',
    options: [
      { id: 'quick-energy', tags: ['energy-gel'] },
      { id: 'hydration', tags: ['isotonic'] },
      { id: 'cramps', tags: ['isotonic'] },
      { id: 'all-around', tags: ['energy-gel', 'isotonic'] },
    ],
  },
  {
    id: 'flavour',
    options: [
      { id: 'orange', tags: ['orange'] },
      { id: 'lemon', tags: ['lemon'] },
      { id: 'raspberry', tags: ['raspberry'] },
      { id: 'any', tags: ['lemon', 'orange', 'raspberry'] },
    ],
  },
  {
    id: 'frequency',
    options: [
      { id: 'casual', tags: ['energy-gel'] },
      { id: 'regular', tags: ['energy-gel', 'isotonic'] },
      { id: 'pro', tags: ['isotonic', 'energy-gel'] },
    ],
  },
]

function getAllProducts(locale: Locale, matchReasons: QuizMatchReasons): QuizRecommendation[] {
  return REAL_PRODUCTS.map((p) => ({
    productId: p._id,
    slug: p.slug,
    name: p.name[locale] ?? p.name.hr,
    category: p.category,
    price: p.variants[0].price,
    matchReason: p.category === 'energetski-gelovi' ? matchReasons.energyGel : matchReasons.isotonic,
    imageUrl: p.mainImage.asset._ref,
  }))
}

/**
 * Calculates dynamic recommendation based on answers.
 */
export function recommendProducts(
  answers: Record<string, string>,
  locale: Locale,
  matchReasons: QuizMatchReasons
): QuizRecommendation[] {
  const allProducts = getAllProducts(locale, matchReasons)

  if (!answers || Object.keys(answers).length === 0) {
    return allProducts.slice(0, 2)
  }

  const selectedTags: string[] = []
  QUIZ_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id]
    if (selectedOptionId) {
      const option = q.options.find((o) => o.id === selectedOptionId)
      if (option) {
        selectedTags.push(...option.tags)
      }
    }
  })

  // Score products based on matching tags
  const scored = allProducts.map((p) => {
    let score = 0
    if (selectedTags.includes(p.category)) score += 3
    if (selectedTags.includes('orange') && p.slug.includes('naranca')) score += 5
    if (selectedTags.includes('lemon') && p.slug.includes('limun')) score += 5
    if (selectedTags.includes('raspberry') && p.slug.includes('malina')) score += 5
    return { product: p, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const topProducts = scored.map((s) => s.product)

  return topProducts.slice(0, 2)
}
