// Feature: honey-bee-power-webshop, Property 1: Page Metadata Integrity
// Validates: Requirements 1.3, 1.6, 16.1, 16.2

import React from 'react'
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Hreflang } from '@/components/seo/Hreflang'

/** Simple path arbitrary */
const pathArb = fc
  .tuple(
    fc.constantFrom('', 'proizvodi', 'vodici', 'b2b', 'kontakt'),
    fc.option(fc.stringMatching(/^[a-z0-9-]{3,15}$/), { nil: undefined }),
  )
  .map(([base, sub]) => (sub ? `/${base}/${sub}` : base ? `/${base}` : '/'))

describe('Property 1: Page Metadata Integrity', () => {
  /**
   * Property: Hreflang helper output for any path MUST contain exactly 5 hreflang link elements
   * (hr, en, de, sl, x-default) and 1 canonical link element.
   *
   * Validates: Requirements 1.3, 1.6
   */
  it('generates exactly 5 hreflang links and 1 canonical link for any route path', () => {
    fc.assert(
      fc.property(pathArb, (pathname) => {
        const component = Hreflang({ pathname })
        const children = React.Children.toArray(component.props.children)

        // Find canonical link
        const canonical = children.filter(
          (child: any) => child?.props?.rel === 'canonical',
        )
        expect(canonical).toHaveLength(1)
        expect((canonical[0] as any).props.href).toContain('/hr')

        // Find alternate hreflang links
        const hreflangs = children.filter(
          (child: any) => child?.props?.rel === 'alternate' && child?.props?.hrefLang,
        )
        expect(hreflangs).toHaveLength(6)

        const hrefLangs = hreflangs.map((h: any) => h.props.hrefLang)
        expect(hrefLangs).toEqual(expect.arrayContaining(['hr', 'en', 'de', 'sl', 'pl', 'x-default']))
      }),
      { numRuns: 100 },
    )
  })
})
