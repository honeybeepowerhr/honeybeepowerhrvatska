'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FAQ, Locale } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductFAQAccordionProps {
  faq: FAQ[]
  /** Locale used to resolve the localized question/answer strings */
  locale?: Locale
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Client Component — FAQ accordion za stranicu proizvoda.
 * Koristi Accordion iz shadcn/ui (@radix-ui/react-accordion).
 * Renderira null ako nema FAQ stavki.
 *
 * WCAG:
 * - Koristi <section> s aria-labelledby headingom
 * - Accordion trigger je semantički <button> unutar <h3>
 * - Svaki item ima jedinstven value koji služi kao id za aria-controls / aria-expanded
 * - Odgovor je u <div> s role="region" (dio Radix primitiva)
 */
export default function ProductFAQAccordion({
  faq,
  locale = 'hr',
}: ProductFAQAccordionProps) {
  if (!faq || faq.length === 0) return null

  return (
    <section aria-labelledby="faq-heading" className="space-y-4">
      <h2
        id="faq-heading"
        className="font-heading font-bold text-xl sm:text-2xl text-charcoal"
      >
        Često postavljana pitanja
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden"
        aria-label="FAQ — Često postavljana pitanja o proizvodu"
      >
        {faq.map((item) => {
          const question = item.question[locale] ?? item.question.hr
          const answer = item.answer[locale] ?? item.answer.hr

          return (
            <AccordionItem
              key={item._key}
              value={item._key}
              className="border-b-0 bg-white px-5 first:rounded-t-xl last:rounded-b-xl"
            >
              {/*
               * AccordionTrigger renders as <button> wrapped in <h3> via
               * AccordionPrimitive.Header which is a <div role="heading" aria-level="3">.
               * This satisfies the WCAG 1.3.1 requirement for semantic structure.
               */}
              <AccordionTrigger className="text-left text-sm font-semibold text-charcoal hover:text-amber-600 hover:no-underline py-4 gap-3">
                {question}
              </AccordionTrigger>

              <AccordionContent className="text-sm text-gray-700 leading-relaxed pb-5 pt-0">
                {answer}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </section>
  )
}
