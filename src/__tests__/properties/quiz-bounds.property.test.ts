// Feature: honey-bee-power-webshop, Property 4: Quiz Recommendation Bounds
// Validates: Requirements 5.2

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { recommendProducts, QUIZ_QUESTIONS } from '@/features/quiz/engine'

/** Arbitrary mapping of question id to option id (partial or complete or empty) */
const quizAnswersArb = fc.record(
  {
    activity: fc.option(fc.constantFrom(...QUIZ_QUESTIONS[0].options.map((o) => o.id)), { nil: undefined }),
    goal: fc.option(fc.constantFrom(...QUIZ_QUESTIONS[1].options.map((o) => o.id)), { nil: undefined }),
    preference: fc.option(fc.constantFrom(...QUIZ_QUESTIONS[2].options.map((o) => o.id)), { nil: undefined }),
    customField: fc.option(fc.string(), { nil: undefined }),
  },
  { requiredKeys: [] },
).map((obj) => {
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) result[k] = v
  }
  return result
})

describe('Property 4: Quiz Recommendation Bounds', () => {
  /**
   * Property: For any set of answers (empty, partial, or full), recommendProducts
   * MUST ALWAYS return between 1 and 3 product recommendations (never 0, never > 3).
   *
   * Validates: Requirements 5.2
   */
  it('always returns between 1 and 3 recommendations for any input', () => {
    fc.assert(
      fc.property(quizAnswersArb, (answers) => {
        const results = recommendProducts(answers, 'hr', {
          energyGel: 'Test energy gel reason',
          isotonic: 'Test isotonic reason',
        })

        expect(Array.isArray(results)).toBe(true)
        expect(results.length).toBeGreaterThanOrEqual(1)
        expect(results.length).toBeLessThanOrEqual(3)

        // Verify each returned item has expected properties
        for (const item of results) {
          expect(item.productId).toBeDefined()
          expect(item.name).toBeDefined()
          expect(item.slug).toBeDefined()
          expect(item.price).toBeGreaterThan(0)
        }
      }),
      { numRuns: 100 },
    )
  })
})
